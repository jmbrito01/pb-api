//TODO: Don't allocate 8976 of buffer size, not very good for performance
const 
    packet_list     = require('../../../packets/list.json');
    
class TCPPacket {
    /**
     * Creates a new TCPPacket object
     * @param opts - [readable], [buffer]
     */
    constructor (opts) {
        this.opts = opts || {};
        if (this.opts.readable === undefined)
			this.opts.readable = true;
		
		if (!this.opts.buffer) {
            this.buff = new Buffer(8976);
            this.buff.fill(0x0);
        } else {
			this.buff = new Buffer(this.opts.buffer);
		}
	
        this.sizeheader = 4;
        this.resetPosition();
        this.advance(0); // Set default size in Buffer
    }

	/**
     * Returns the packet data
     * @param {Number} [start] - The start of the packet data ( default = 0 )
     * @returns {Buffer}
     */
    getData (start) {
        if (start === undefined) start = 0;
        return this.buff.slice(start, this.getPacketSize());
    }

    getPacketContent() {
        return this.buff.slice(this.sizeheader, this.getContentSize());
    }
    clean() {
        this.buff = this.getData();
    }

	/**
	 * Resets the position of reading/writing of the packet
     */
    resetPosition() {
        this.position = this.opts.readable ? 0 : 2;
    }

	/**
     * Returns the creation options of the packet
     * @returns {Object}
     */
    getOptions () {
        return this.opts;
    }

	/**
	 * Sets the packet protocol id
     * @param id - the protocol id
     */
    setProtocolID (id) {
        this.buff.writeUInt16LE(id, 2);
    }

	/**
	 * Returns the packet's protocol id
     * @returns {Number}
     */
    getProtocolID () {
        return this.buff.readUInt16LE(2);
    }

	/**
	 * Set the packet's content size
     * @param {Number} len - the new size
     */
    setContentSize(len) {
        this.buff.writeUInt16LE(len, 0);
    }

	/**
     * Retrieves the content size
     * @returns {Number}
     */
    getContentSize () {
        return this.buff.readUInt16LE(0);
    }

    /**
     * Returns the whole packet size ( content + header )
     * @returns {number}
     */
    getPacketSize () {
        var val = (this.getContentSize() & 0x7FFF) + this.sizeheader;
        return val;
    }

	/**
     * Sets the packet's encryption hash
     * @param hash - the new hash
     */
    setHash (hash) {
        if (!this.opts.readable) {
            this.buff.writeUInt16LE(hash, 4);
        }
    }

	/**
	 * Returns the packet's hash
     * @returns {Number}
     */
    getHash () {
        if (!this.opts.readable) {
            return this.buff.readUInt16LE(4);
        } else {
            return null;
        }
    }

	/**
	 * Advances the position of the reading/writing of the packet
     * @param length - The size of the advance
     */
    advance (length) {
        this.position += length;
		if(!this.opts.readable)
        {
			this.setContentSize(this.position);
        }
    }

	/**
	 * Logs the current packet's information
     */
    log () {       
        console.log(`[ PACKET ] --- ProtocolId: ${this.getProtocolID()}`);
        console.log(`[ PACKET ] --- Size: ${this.getPacketSize()}`);
    }

	/**
     * Writes data to the packet
     * @param {Buffer} data
     * @param len - How much you wish to write of the data buffer
     */
    write (data, len) {
        if (this.buff.length >= this.position + this.sizeheader + len) {
            data.copy(this.buff, this.position + this.sizeheader, 0, len);
        } else {
            this.buff = Buffer.concat([this.getData(), data], this.getData().length + len);
        }
        this.advance(len);
    }
	/**
	 * Writes a byte to the buffer
     * @param {Number} value
     */
    writeByte (val) {
        this.buff.writeUInt8(val, this.position + this.sizeheader);
        this.advance(1);
    }
	/**
     * Writes a word(2 bytes) to the buffer
     * @param {Number} value
     */
    writeWord (val) {
        this.buff.writeUInt16LE(val, this.position + this.sizeheader);
        this.advance(2);
    }
	/**
     * Writes a dword(4 bytes) to the buffer
     * @param {Number} value
     */
    writeDword (val) {
        this.buff.writeUInt32LE(val, this.position + this.sizeheader);
        this.advance(4);
    }
	/**
     * Writes a double(8 bytes) to the buffer
     * @param {Number} value
     */
    writeDouble(val) {
        this.buff.writeDoubleLE(val, this.position + this.sizeheader);
        this.advance(8);
    }
	/**
     * Writes a IP in the PointBlank's way
     * @param {Number} value - The ip as a string eg 127.0.0.1
     */
    writeIP(val) {
        var val = new Buffer(val.split('.').map(function (each) { return parseInt(each); }));
        this.write(val, val.length);
    }
	/**
     * Writes a string
     * @param {String} str - the string to be written
     * @param {Number} [len] - If no length specified, the whole string is written
     */
    writeString(str, len) {
        var buff = new Buffer(str);
        
        if (buff.length > len) {
            this.write(buff, len);
        } else {
            this.write(buff, buff.length);
        }
        
        if (buff.length < len) {
            var size = len - buff.length;
            buff = new Buffer(size).fill(0);
            this.write(buff, size);
        }
    }
	/**
	 * Writes a vector
     * @param {Vector} vec - the vector to be written
     */
    writeVector(vec) {
        var buff = new Uint32Array([vec.x, vec.y, vec.z]).buffer;

        this.write(buff, buff.length);
    }
    
	/**
     * Reads the next vector of the buffer antes advances to the next byte
     * @returns {Vector}
     */
    nextVector() {
        var vec = {};
        
        vec.x = this.nextDword();
        vec.y = this.nextDword();
        vec.z = this.nextDword();
        
        return vec;
    }
	/**
     * Reads the next byte of the buffer and advances to the next one.
     * @returns {Number}
     */
    nextByte () {
        var val = this.buff.readUInt8(this.position + this.sizeheader);
        this.advance(1);
        return val;
    }
    /**
     * Reads the next word ( 2 bytes ) of the buffer and advances to the next one.
     * @returns {Number}
     */
    nextWord () {
        var val = this.buff.readUInt16LE(this.position + this.sizeheader);
        this.advance(2);
        return val;
    }
    /**
     * Reads the next dword ( 4 bytes ) of the buffer and advances to the next one.
     * @returns {Number}
     */
    nextDword () {
        var val = this.buff.readUInt32LE(this.position + this.sizeheader);
        this.advance(4);
        return val;
    }
    /**
     * Reads the next ip ( 4 bytes ) of the buffer and advances to the next one.
     * @returns {String}
     */
    nextIP () {
        var val = `${this.nextByte()}.${this.nextByte()}.${this.nextByte()}.${this.nextByte()}`;
        return val;
    }
    /**
     * Reads the next double ( 8 bytes ) of the buffer and advances to the next one.
     * @returns {Number}
     */
    nextDouble() {
        var val = this.buff.readDoubleLE(this.position + this.sizeheader);
        this.advance(8);
        return val;
    }
    /**
     * Reads the next string of the buffer and advances.
     * @param {Number} [size] - The size of the string, if no size, searches for the next null byte
     * @returns {String}
     */
    nextString (size) {
        var location = this.position + this.sizeheader;

        var i = 0;
        while (this.buff.readUInt8(i + location) !== 0 ) {
            if (i + location > this.buff.length) break;
            i++;
        }
        var str = this.buff.slice(location, location + i).toString("ascii");
        this.advance(size);
        return str;         
    }

	/**
     * Encrypts the current packet's data
     * @param shiftSize - the size of the encryption shift
     * @returns {boolean} - True if everything went ok, false otherwise.
     */
    encrypt (shiftSize) {
        var len = this.getContentSize();
        if (len >= 0x7FFF) return false; // Already Encripted

        var startByte = 2;

        var length = this.getPacketSize();
        var firstByte = this.buff.readUInt8(startByte);
        for (let i = startByte; i < length; i++) {
            var currentByte = this.buff.readUInt8(i);        
            var nextByte = this.buff.readUInt8(i + 1); 
            if (i >= length-1) {
                this.buff.writeUInt8((firstByte >> (8 - shiftSize) | currentByte << shiftSize) & 0xFF, i);
            } else {
                this.buff.writeUInt8((nextByte >> (8 - shiftSize) | currentByte << shiftSize) & 0xFF, i);        
            }
        }
        this.setContentSize(len | 0x8000);
        return true;
    }

	/**
	 * Joins this packet's buffer with another one
     * @param buff - The buffer to be joined with
     * @param [len] - How much of the buff to be joined ( default = all )
     */
    joinBuffer(buff, len) {
        if (len === undefined) len = buff.length;
        let finalBuff = Buffer.concat([this.buff, buff], this.buff.length + len);
        this.buff = finalBuff;
    }

	/**
     * Returns a package class by the protocol id
     * @param protocol_id
     * @returns {Packet}
     */
    static getByProtocolId (protocol_id) {
        var object = null;
        packet_list.forEach(function (each) {
            if (!each.clean && each.protocol_id === protocol_id) {
                try {
                    object = require(`../../../packets/${each.source}/${each['class']}`);
                } catch (e) {
                    throw `Packet class for ${each.name} could not be loaded with error ${e}`;
                }
            }
        });
        return object;
    }

	/**
     * Retrieves the packet name by giving the protocolId
     * @param protocol_id
     * @returns {String}
     */
    static protocolIdToName (protocol_id) {
        var name = "PROTOCOL_UNKNOWN";
        packet_list.forEach(function (each) {
            if (each.protocol_id === protocol_id) {
                name = each.name;
            }
        });
        return name;
    }

    /**
     * Finds a packet instance by it's name
     * @param name - The name of the packet eg PROTOCOL_BASE_LOGIN_REQ
     * @returns {Packet}
     */
    static find (name) {
        var obj = null;
        packet_list.forEach(function (each) {
            if (each.name === name) {
                obj = each;
            }
        });
        return obj;
    }
}
module.exports = TCPPacket;
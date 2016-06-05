//TODO: Document UDPPacket class

class UDPPacket {
    /*
     * @Constructor
     */
    constructor(opts) {
        this.opts = opts || {};

        if (!this.opts.buffer) {
            this.buff = new Buffer(8976);
            this.buff.fill(0x0);
        } else {
            this.buff = new Buffer(this.opts.buffer);
        }

        this.sizeheader = 13;
        this.position = 0;

    }

    encrypt () {
        var startByte = 13;
        var shiftSize = (this.getPacketSize() % 6) + 1;

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
        return true;
    }
    
    getPacketSize() {
        return this.buff.readUInt16LE(7);
    }
    
    getData() {
        return this.buff.slice(0, this.position + this.sizeheader);
    }

    getProtocolId() {
        return this.buff.readUInt8(0);
    }

    setProtocolId(id) {
        this.buff.writeUInt8(id, 0);
    }

    getSlot() {
        return this.buff.readUInt8(1);
    }

    setSlot(slot) {
        this.buff.writeUInt8(slot, 1);
    }

    setAccountId(id) {
        var acc = new Buffer(8);
        acc.writeDoubleLE(id);
        this.buff.writeUInt8(acc.readUInt8(0), 11);
        this.buff.writeUInt8(1, 12);
    }

    advance(length) {
        this.position += length;
        this.setPacketSize(this.position + this.sizeheader);
    }
    
    setPacketSize(size) {
        this.buff.writeUInt16LE(size, 7);
    }

    /*
     * @Write Content - Write in Content of the Packet
     */
    writeByte (val) {
        this.buff.writeUInt8(val, this.position + this.sizeheader);
        this.advance(1);
    }
    /*
     * @Write Content - Write in Content of the Packet
     */
    writeWord (val) {
        this.buff.writeUInt16LE(val, this.position + this.sizeheader);
        this.advance(2);
    }
    /*
     * @Write Content - Write in Content of the Packet
     */
    writeDword (val) {
        this.buff.writeUInt32LE(val, this.position + this.sizeheader);
        this.advance(4);
    }
    /*
     * @Read Content - Read in Content of the Packet
     */
    nextByte () {
        var val = this.buff.readUInt8(this.position + this.sizeheader);
        this.advance(1);
        return val;
    }
    /*
     * @Read Content - Read in Content of the Packet
     */
    nextWord () {
        var val = this.buff.readUInt16LE(this.position + this.sizeheader);
        this.advance(2);
        return val;
    }
    /*
     * @Read Content - Read in Content of the Packet
     */
    nextDword () {
        var val = this.buff.readUInt32LE(this.position + this.sizeheader);
        this.advance(4);
        return val;
    }
    /*
     * @Read Content - Read in Content of the Packet
     */
    nextString (size) {
        var Location = this.position + this.sizeheader;

        if (size == undefined) {
            var i = 0;
            while (this.buff.readUInt8(++i + Location) !== 0 ) {
                if (i + Location > this.buff.length) return "";
            }
            size = i;
        }
        var str = this.buff.slice(Location, Location + size).toString("ascii");
        this.advance(size);
        return str;
    }


}

module.exports = UDPPacket;
const   
    net             = require('net'),
    Packet          = require('./packet'),
    EventEmitter    = require('../../eventEmitter'),
    packet_list     = require('../../../packets/list.json');

/**
 * Class to handle the TCP Connection with the game
 */
class TCPConnection extends EventEmitter {

	/**
	 * Creates a new TCPConnection
     * @param opts - port,ip
     */
    constructor (opts) {
        super(opts);
        this.opts = opts || {};
        this.connected = false;
        this.servers = [];

        this.conn = new net.Socket();

        this.conn.on('data', this.onRead.bind(this));
        this.conn.on('end', this.onDisconnect.bind(this));
        this.conn.connect(this.opts.port, this.opts.ip, this.onConnect.bind(this));

    }

    // OnConnect Event
    onConnect () {
        //Executed when connected
        this.connected = true;
        this.triggerEvent('connect');
    }
    // OnDisconnect Event
    onDisconnect () {
        //Executed when disconnect
        this.connected = false;
        this.triggerEvent('disconnect');
    }
    // OnRead Buffer
    onRead(data) {
        // Define tempBuff
        if (!this.tempBuff) {
            this.tempBuff = new Packet({buffer: data});
        } else {
            this.tempBuff.joinBuffer(data, data.length);
        }
        // Compare Buff
        var CurrentLen     = this.tempBuff.getPacketSize();
        var MissingBytes   = CurrentLen - this.tempBuff.buff.length;
        var RemainingBytes = this.tempBuff.buff.length - CurrentLen;
        // Missing Bytes
        if (MissingBytes > 0) return;
        // Remaining Bytes
        if (RemainingBytes > 0 ) {
            var remainingBuff = this.tempBuff.buff.slice(CurrentLen, this.tempBuff.buff.Length);
            this.tempBuff  = new Packet({buffer: this.tempBuff.getData()});
        }
        // SendPacket
        this.onPacket(this.tempBuff);
        this.tempBuff = null;
        this.triggerEvent('read', data);

        // Remaining Bytes
        if (remainingBuff !== undefined)
            this.onRead(remainingBuff);
    }
    // OnPacket (ParsingPacket)
    onPacket(packet) {
        //On packet recieved and checked
        var ProtocolPacket = Packet.getByProtocolId(packet.getProtocolID());
        if (ProtocolPacket ) {
            //Is a known packet
            let opts = packet.getOptions();
            opts.conn = this;
            packet = new ProtocolPacket(opts);
        }
        //Packet is now handled
        if (process.env.DEBUG) {
            var namePacket = Packet.protocolIdToName(packet.getProtocolID());
            console.log(`[ CONNECTOR ] Receive ${namePacket}`);
            packet.log();
        }

        this.triggerEvent('packet', packet);
        //Trigger ready when recieved first packet
        if (!this.ready) {
            this.ready = true;
            this.triggerEvent('ready');
        }
    }
    // On Write Buffer
    onWrite() {
        //Executed when write is completed
        this.triggerEvent('write');
    }

	/**
	 * Destroy the socket connection
     */
    destroy() {
        this.conn.destroy();
    }

	/**
	 * Sends a Packet 
     * @param packet - A packet object
     */
    sendPacket(packet) {        
        var enc = ((214013 * this.getHash() + 2531011) >> 0x10) & 0x7FFF;
        this.setHash(enc);
        packet.setHash(enc);

        packet.encrypt(this.getShiftSize());
        this.conn.write(packet.getData(), 'binary', this.onWrite.bind(this));
    }

	/**
	 * Sends a known packet ( provided in ROOT/packets/list.json )
     * @param name - The name of the packet to be sent (eg PROTOCOL_BASE_LOGIN_REQ)
     * @param opts - Aditional informations to send to new packets creation options
     * @returns {Promise} - A promise if the packet has a known response, nothing otherwise.
     *  The promise will return the object of the response packet
     */
    sendKnownPacket (name, opts) {
        var self = this;
        return new Promise(function (resolve, reject) {
            opts = opts || {};
            packet_list.forEach(function (each) {
                if (each.name === name) {
                    //Is the packet we are looking for
                    if (process.env.DEBUG) {
                        console.log(`[ CONNECTOR ] Sending ${name}`);
                    }                    
                    
                    try {
                        opts.readable = false; //Always send write packets
                        opts.conn = self;
                        if (each.clean) {
                            var packet = new Packet(opts);
                        } else {
                            var ProtocolPacket = require(`../../../packets/${each.source}/${each.class}`);
                            var packet = new ProtocolPacket(opts);
                        }
                    } catch (e) {
                        console.log(`[ ERROR ] Could not load packet. ERROR ${e}`);
                        throw `Could not load packet. ERROR ${e}`;
                    }
                    
                    packet.setProtocolID(each.protocol_id);
                    if (process.env.DEBUG) {
                        packet.log();
                    }
                    
                    //Handle response
                    if (each.response) {
                        let response = Packet.find(each.response);
                        self.on('packet', function (packet) {
                            if (packet.getProtocolID() === response.protocol_id) {
                                resolve(packet);
                                return true;
                            }
                        });
                    }

                    self.sendPacket(packet);
                }
            });
        });
    }

	/**
	 * Sets the encryption shift size
     * @param c - the new shift size
     */
    setShiftSize(c) {
        this.shiftSize = c;
    }

	/**
     * Returns the encryption shiftSize
     * @returns {Number}
     */
    getShiftSize () {
        return this.shiftSize;
    }

	/**
	 * Sets the session id
     * @param {Number} id
     */
    setSessionId (id) {
        this.sessionId = id;
    }

	/**
     * Gets the session id
     * @returns {*}
     */
    getSessionId () {
        return this.sessionId;
    }

	/**
	 * Sets the encryption hash of the last packet
     * @param {Number} hash 
     */
    setHash (hash) {
        this.hash = hash;
    }

	/**
     * Retrieves the last packet hash
     * @returns {Number}
     */
    getHash () {
        return this.hash;
    }
    
    // Set Server Obj
    addGameServer (obj) {
        this.servers.push(obj);
    }

	/**
	 * Sets the accountId in the connection
     * @param {Number} accountId - the new accountId
     */
    setAccountId(accountId) {
        this.accountId = accountId;
    }

	/**
     * Retrives the account id
     * @returns {Number|*}
     */
    getAccountId() {
        return this.accountId;
    }
}

module.exports = TCPConnection;
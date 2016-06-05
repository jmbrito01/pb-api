const
    dgram               = require('dgram'),
    EventEmitter        = require('../../eventEmitter'),
    UDPPacket           = require('./packet');

/**
 * Class to handle UDP connections (NOT DONE YET)
 */
class UDPConnection extends EventEmitter {
	/**
     * Creates a new UDPConnection instance
     * @param opts - port, accountId, server, slot
     */
    constructor(opts) {
        super(opts);
        
        this.port = opts.port;
        this.accountId = opts.accountId;
        this.server = opts.server;
        this.slot = opts.slot;
        
        this.conn = new dgram.createSocket('udp4');

        this.conn.on('message', this.onRead.bind(this));
        this.conn.on('listening', this.onConnect.bind(this));
        
        this.conn.bind(opts.port);
    }

	/**
     * Sends a simple message in the tcp to the server
     * @param {Buffer} msg - The buffer message
     * @param {Number} port
     * @param {String} addr
     * @returns {Promise}
     */
    send(msg, port, addr) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.conn.send(msg, 0, msg.length, port, addr, function (err) {
                if (err) reject(err);
                else resolve();
            });
        });
    }

	/**
     * Sends a packet to the server
     * @param {Packet} packet - the packet object
     * @returns {Promise}
     */
    sendPacket(packet) {
        packet.setAccountId(this.accountId);
        packet.setSlot(this.slot);
        packet.encrypt();
        return this.send(packet.getData(), this.server.port, this.server.ip);
    }

    onRead(msg, rinfo) {
        console.log(`[ UDP CONNECTION ] Message received with size ${msg.length}`);
        
        var packet = new UDPPacket({
            buffer: msg
        });
        
        console.log(`[ UDP PACKET ] -- Protocol Id: ${packet.getProtocolId()}`);
    }

    onConnect() {
        console.log('[ UDP CONNECTION ] Is binded with the port ', this.port);
        this.triggerEvent('connect');
    }
}

module.exports = UDPConnection;
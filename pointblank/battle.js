const
    EventEmitter        = require('../util/eventEmitter'),
    Connection          = require('../util/connection/udp'),
    IntrudePacket       = require('../packets/client/battle/intrude');

/**
 * Class for handling the udp battle system (NOT DONE YET)
 */
class Battle extends EventEmitter {
	/**
     * Creates a new PBBattle instance 
     * @param opts
     */
    constructor(opts) {
        super(opts);
        this.opts = opts;
        this.accountId = opts.accountId;
        this.connected = false;
        this.slot = opts.slot;
        this.version = opts.version;
    }

	/**
	 * Connects to the UDP and sends the intude packet
     * @param opts - port, server, infoBattle
     * @returns {Promise}
     */
    connect(opts) {
        this.port = opts.port;
        this.server = opts.server;
        this.infoBattle = opts.infoBattle;
        var self = this;
        return new Promise(function (resolve, reject) {
            self.conn = new Connection({
                accountId: self.accountId,
                server: self.server,
                port: self.port,
                slot: self.slot
            });

            self.conn.on('connect', self.onConnect.bind(self));

            resolve();
        });
    }
    
    onConnect() {
        console.log(`[ BATTLE CONNECTION ] Listening to port ${this.port}`);

        var packet = new IntrudePacket({
            infoBattle: this.infoBattle,
            slot: this.slot,
            udpVersion: this.version
        });

        this.conn.sendPacket(packet);

        this.connected = true;
        
        this.triggerEvent('connect');
    }
}

module.exports = Battle;
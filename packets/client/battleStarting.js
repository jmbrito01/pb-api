const
    Packet = require('../../util/connection/tcp/packet');

class BattleStartingPacket extends Packet {
    constructor(opts) {
        super(opts);

        this.map = opts.map;
        this.writeByte(this.map.length+1);
        this.write(new Buffer(this.map, 'ascii'), this.map.length);
        this.writeByte(0); //null-terminated
    }
}

module.exports = BattleStartingPacket;
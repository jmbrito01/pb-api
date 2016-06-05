const
    Packet = require('../../util/connection/tcp/packet');

class BattlePreparationPacket extends Packet {
    constructor(opts) {
        super(opts);

        //this.mapId = opts.mapId
        this.writeWord(opts.mapId);
        this.writeByte(0); //Unknown
        this.writeByte(1); //Unknown
    }
}

module.exports = BattlePreparationPacket;
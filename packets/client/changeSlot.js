const
    Packet = require('../../util/connection/tcp/packet');

class ChangeSlotPacket extends Packet {
    constructor(opts) {
        super(opts);
        this.writeDword(opts.team);
    }

    log () {
        console.log(`[ PACKET ] --- Team: ${this.getOptions().team}`);
    }
}

module.exports = ChangeSlotPacket;
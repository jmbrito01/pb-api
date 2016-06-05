const
    Packet          = require('../../../util/connection/udp/packet');

class HelloBattlePacket extends Packet {
    constructor(opts) {
        super(opts);
        this.setProtocolId(41);
        this.writeDword(opts.test_values[0]);
        this.writeDword(opts.test_values[1]);
    }
}

module.exports = HelloBattlePacket;
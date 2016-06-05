const
    Packet = require('../../util/connection/tcp/packet');
    
class EnterChannelPacket extends Packet {
    constructor(opts) {
        super(opts);
        this.writeDword(opts.channel+1);
    }
}

module.exports = EnterChannelPacket;
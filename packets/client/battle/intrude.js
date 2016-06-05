const
    UDPPacket           = require('../../../util/connection/udp/packet');

class IntrudePacket extends UDPPacket {
    constructor(opts) {
        super(opts);
        this.setProtocolId(0x41);
        this.writeDword(opts.udpVersion[0]); //Major Version UDP eg [1012, 18]
        this.writeDword(opts.udpVersion[1]); //Minor Version UDP
        this.writeDword(opts.infoBattle[0]);
        this.writeDword(opts.infoBattle[1]);
        this.writeByte(opts.slot);
    }
}

module.exports = IntrudePacket;
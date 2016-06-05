const
    Packet = require('../../util/connection/tcp/packet');
    
class AuthenticatePacket extends Packet {
    constructor(opts) {
        super(opts);
        var unk2 = 0x00;
        this.writeByte(opts.username.length + 1);
        this.write(new Buffer(opts.username, 'ascii'), opts.username.length + 1);
        this.writeDouble(opts.accountId);
        this.writeByte(unk2);
        this.writeIP("192.168.0.1");
    }
}

module.exports = AuthenticatePacket;
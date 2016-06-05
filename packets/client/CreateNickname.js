const
    Packet = require('../../util/connection/tcp/packet');
    
class CreateNicknamePacket extends Packet {
    constructor(opts) {
        super(opts);
        this.writeByte(opts.Nickname.length + 1);
        this.write(new Buffer(opts.Nickname, 'ascii'), opts.Nickname.length);
        this.writeByte(0);// null-termianted
    }
    
    log ()
    {
        console.log(`[ PACKET ] --- Nickname: ${this.getOptions().Nickname}`);
    }
}

module.exports = CreateNicknamePacket;
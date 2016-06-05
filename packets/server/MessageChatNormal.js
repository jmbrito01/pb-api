const
    Packet      = require('../../util/connection/tcp/packet');

class MessageChatNormalPacket extends Packet {
    constructor (opts) {
        super(opts);
        this.advance(4); // Unknown
        this.advance(1); // Size NickFrom+1
        this.FromUsername   = this.nextString();
        this.advance(1); // null-terminated
        this.advance(2); // Unknown
        this.advance(2); // Size of Message
        this.Message = this.nextString();
    }

    log () {
        console.log(`[ PACKET ] --- From Username: ${this.FromUsername}`);
        console.log(`[ PACKET ] --- Text: ${this.Message}`);
    }

}

module.exports = MessageChatNormalPacket;
const
    Packet      = require('../../util/connection/tcp/packet');

class MessageChatWhisperPacket extends Packet {
    constructor (opts) {
        super(opts);
        this.fromnickname = this.nextString(33);
        this.advance(1); // null-terminated
        this.advance(2); // Size of Message
        this.message = this.nextString();
        
        /*this.opts.conn.sendKnownPacket('PROTOCOL_MESSAGE_CHAT_WHISPER_REQ', {
            nickname: this.fromnickname, 
            message: "teste"
        });*/
    }

    log () {
        console.log(`[ PACKET ] --- From Nickname: ${this.fromnickname}`);
        console.log(`[ PACKET ] --- Text: ${this.message}`);
    }
}

module.exports = MessageChatWhisperPacket;
const
    Packet = require('../../util/connection/tcp/packet');
    
class MessageChatWhisperPacket extends Packet {
    constructor(opts) {
        super(opts);
        // Configure Packet
        this.nickname = opts.nickname;
        this.message = opts.message;
        // Write Packet
        this.write(new Buffer(this.nickname, 'ascii'), 33); // From Nickname
        this.writeWord(this.message.length+1);//Length Message  
        this.write(new Buffer(this.message, 'ascii'), this.message.length);
        this.writeByte(0); // null-terminated
    }
    
    log () {
        console.log(`[ PACKET ] --- From Nickname: ${this.nickname}`);
        console.log(`[ PACKET ] --- Message: ${this.message}`);
    }
}

module.exports = MessageChatWhisperPacket;
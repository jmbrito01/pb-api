const
    Packet = require('../../util/connection/tcp/packet');
    
class MessageChatNormalPacket extends Packet {
    constructor(opts) {
        super(opts);
        // Configure Packet
        this.messageType = opts.messageType === undefined ? 1 : opts.MessageType;
        this.message = opts.message;
        // Write Packet
        this.writeWord(this.messageType); // Type (01 = Normal, 04 = Team)
        this.writeWord(this.message.length + 1);
        this.write(new Buffer(opts.message, 'ascii'), opts.message.length);
        this.writeByte(0);
    }
    
    log () {
        console.log(`[ PACKET ] --- MessageType: ${this.getOptions().messageType}`);
        console.log(`[ PACKET ] --- Message: ${this.getOptions().message}`);
    }
}

module.exports = MessageChatNormalPacket;
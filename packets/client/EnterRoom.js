const
    Packet = require('../../util/connection/tcp/packet');
    
class EnterRoomPacket extends Packet {
    constructor(opts) {
        super(opts);
        this.writeDword(opts.room-1);
        this.write(new Buffer("", 'ascii'), 4);// Password
        this.writeByte(1);// Ignore Password Room
    }
    
    log () {
        console.log(`[ PACKET ] --- Room: ${this.getOptions().room}`);
    }
}

module.exports = EnterRoomPacket;
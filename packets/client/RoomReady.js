const
    Packet = require('../../util/connection/tcp/packet');
    
class RoomReadyPacket extends Packet {
    constructor(opts) {
        super(opts);
        this.writeDword(0); // Ready
    }
}

module.exports = RoomReadyPacket;
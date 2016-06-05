const
    Packet          = require('../../util/connection/tcp/packet'),
    stages          = require('../const/stages.json');

class RoomInfoPacket extends Packet {
    constructor (opts) {
        super(opts);
        var self = this;

        this.mapId = this.nextWord();
    }

    getMapId() {
        return this.mapId;
    }

    getMapName(id) {
        var result = null;
        stages.forEach(function (each) {
            if (each.id === id) result = each;
        });
        if (result) return result.name;
        else return result;
    }

    log () {
        console.log(`[ PACKET ] --- Map Name: ${this.getMapName(this.mapId)}`);
        console.log(`[ PACKET ] --- Map Id: ${this.mapId}`);
    }
}

module.exports = RoomInfoPacket;
const
    Packet          = require('../../util/connection/tcp/packet'),
    stages          = require('../const/stages.json');

class RoomListPacket extends Packet {
    constructor (opts) {
        super(opts);

        this.roomCount = this.nextDword();
        this.nextDword(); //Unknown = 0
        this.roomCount = this.nextDword(); //Room count again?
        this.rooms = [];
        console.log(this.roomCount);
        for (let i = 0; i < this.roomCount;i++) {
            var room = {};
            room.id             = this.nextDword();
            room.name           = this.nextString(23);
            room.mapId          = this.nextByte();
            room.mapName        = this.getMapName(room.mapId);
            this.nextWord();    //unk = 0
            room.type           = this.nextByte();
            room.isFighting     = this.nextByte();
            room.playerCount    = this.nextByte();
            room.slots          = this.nextByte();
            this.nextDword(); //unk

            this.rooms.push(room);
        }

        this.playerCount = this.nextDword();
    }

    getMapName(idx) {
        for (let i = 0;i < stages.length;i++) {
            if (stages[i].id == idx) return stages[i].name;
        }
        return 'UNKNOWN';
    }

    log () {
        console.log(`[ PACKET ] --- Players in lobby: ${this.playerCount}`);
        console.log(`[ PACKET ] --- Room Count: ${this.roomCount}`);
        this.rooms.forEach(function (each) {
            console.log(`[ PACKET ] --- -- Room (${each.id}): ${each.name} (${each.playerCount}/${each.slots})`);
        });
    }
}

module.exports = RoomListPacket;
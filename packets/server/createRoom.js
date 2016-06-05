const
	Packet          = require('../../util/connection/tcp/packet');

class CreateRoomPacket extends Packet {
	constructor(opts) {
		super(opts);

		this.room = {};

		this.room.id         =   this.nextDword();
		this.nextDword();     //id again
		this.room.name           = this.nextString(23);
		this.room.mapId          = this.nextByte();
		this.nextByte();      // unk
		this.room.stage          = this.nextByte();
		this.room.type           = this.nextByte();
		this.room.playerCount    = this.nextByte();
		this.nextByte();      // unk
		this.room.slots          = this.nextByte();
		this.nextByte();      // unk
		this.room.allWeapons     = this.nextByte();
		this.room.randomMap      = this.nextByte();
		this.room.special        = this.nextByte();
		this.room.leaderName     = this.nextString(33);
		this.room.killMask       = this.nextByte();
		this.nextByte();      // unk
		this.nextByte();      // unk
		this.nextByte();      // unk
		this.room.limit          = this.nextByte();
		this.room.seeConf        = this.nextByte();
		this.room.autoBalance    = this.nextWord();
	}

	getRoom() {
		return this.room;
	}

	log() {
		var room = this.getRoom();
		console.log(`[ PACKET ] -- Room id: ${room.id}`);
		console.log(`[ PACKET ] -- Room name: ${room.name}`);
		console.log(`[ PACKET ] -- Players: ${room.playerCount}/${room.slots}`);
	}
}

module.exports = CreateRoomPacket;
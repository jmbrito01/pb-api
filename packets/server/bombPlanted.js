const
	Packet          = require('../../util/connection/tcp/packet');

class BombPlantedPacket extends Packet {
	constructor (opts) {
		super(opts);

		this.slot       = this.nextDword();
		this.zone       = this.nextByte();
		this.nextWord(); //unk
		this.pos        = this.nextVector();
	}
	
	getBombZone() {
		return this.zone;
	}
	
	getBombPos() {
		return this.pos;
	}
	
	getArmerSlot() {
		return this.slot;
	}

	log () {
		console.log(`[ PACKET ] --- Armer slot: ${this.slot}`);
		console.log(`[ PACKET ] --- Bomb Zone: ${this.zone}`);
		console.log(`[ PACKET ] --- Bomb Pos: (${this.pos.x}, ${this.pos.y}, ${this.pos.z})`);
	}
}

module.exports = RoomListPacket;
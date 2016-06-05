const
	Packet          = require('../../util/connection/tcp/packet');

class RoomInfoPacket extends Packet {
	constructor (opts) {
		super(opts);

		this.advance(1); // Unknown
		this.victimIdx = this.nextByte();
		this.killerIdx = this.nextByte();
		this.killsCount = this.nextByte();
		this.killWeapon = this.nextDword();
	}
	
	getVictimId() {
		return this.victimIdx;
	}

	log () {
		console.log(`[ PACKET ] --- VictimIdx: ${this.victimIdx}`);
		console.log(`[ PACKET ] --- KillerIdx: ${this.killerIdx}`);
	}
}

module.exports = RoomInfoPacket;
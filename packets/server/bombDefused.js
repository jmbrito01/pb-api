const
	Packet          = require('../../util/connection/tcp/packet');

class BombDefusedPacket extends Packet {
	constructor (opts) {
		super(opts);

		this.slot       = this.nextDword();
	}
	
	getDefuserSlot() {
		return this.slot;
	}

	log () {
		console.log(`[ PACKET ] --- Defuser slot: ${this.slot}`);
	}
}

module.exports = RoomListPacket;
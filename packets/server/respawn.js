const
	Packet          = require('../../util/connection/tcp/packet');

class RoomInfoPacket extends Packet {
	constructor (opts) {
		super(opts);

		this.slot = this.nextDword();
		this.nextDword();
		this.nextDword();

		this.nextDword();
		this.nextDword();
		this.nextDword();
		this.nextDword();
		this.nextDword();
		this.id = this.nextDword();
	}

	log () {
		console.log(`[ PACKET ] --- Slot: ${this.slot}`);
		console.log(`[ PACKET ] --- id: ${this.id}`);
	}
}

module.exports = RoomInfoPacket;
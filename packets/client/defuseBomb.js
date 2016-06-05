const
	Packet = require('../../util/connection/tcp/packet');

class DefuseBombPacket extends Packet {
	constructor(opts) {
		super(opts);

		this.slot = this.nextDword();
	}

	log() {
		console.log(`[ PACKET ] --- Slot: ${this.slot}`);
	}
}

module.exports = DefuseBombPacket;
const
	Packet = require('../../util/connection/tcp/packet');

class PlantBombPacket extends Packet {
	constructor(opts) {
		super(opts);

		this.zone = opts.zone;
		this.pos = opts.pos;
		this.writeDword(opts.slot);
		this.writeByte(opts.zone);
		this.writeVector(opts.pos);
	}

	log() {
		console.log(`[ PACKET ] --- Zone: ${this.zone}`);
		console.log(`[ PACKET ] --- Pos: (${this.pos.x}, ${this.pos.y}, ${this.pos.z})`);
	}
}

module.exports = PlantBombPacket;
const
	Packet = require('../../util/connection/tcp/packet');

class RoomReadyPacket extends Packet {
	constructor(opts) {
		super(opts);
		
		this.writeDword(opts.equipment.prim);
		this.writeDword(opts.equipment.pistol);
		this.writeDword(opts.equipment.melee);
		this.writeDword(opts.equipment.throwing);
		this.writeDword(opts.equipment.bomb);
		this.writeDword(opts.slot);
		this.writeDword(opts.equipment.red);
		this.writeDword(opts.equipment.blue);
		this.writeDword(opts.equipment.head);
		this.writeDword(opts.equipment.beret);
		this.writeDword(opts.equipment.dino);
		this.writeByte(0xF);
	}
}

module.exports = RoomReadyPacket;
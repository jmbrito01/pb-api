const
	TCPPacket           = require('../../util/connection/tcp/packet');

class CreateRoomPacket extends TCPPacket {
	constructor(opts) {
		super(opts);

		//Setup opts
		opts.special        = opts.special      === true ? 1 : 0;
		opts.killMask       = opts.killMask     === true ? 1 : 0;
		opts.limit          = opts.limit     === true ? 1 : 0;
		opts.seeConf        = opts.seeConf     === true ? 1 : 0;
		opts.autoBalance    = opts.autoBalance  === true ? 1 : 0;

		this.name           = opts.name;
		this.mapId          = opts.mapId || 1;
		this.slots          = opts.slots || 16;
		this.password       = opts.password || null;
		this.playerName     = opts.playerName;
		this.type           = opts.type || 1;
		this.allWeapons     = opts.allWeapons || 10;
		this.randomMap      = opts.randomMap || 4;
		//Start writing the packet
		this.writeDword(0); //unk
		this.writeString(opts.name, 23);
		this.writeByte(this.mapId);
		this.writeByte(0); //unk
		this.writeByte(opts.stage);
		this.writeByte(this.type);
		this.writeWord(0); //unk
		this.writeByte(this.slots);
		this.writeByte(0); //unk
		this.writeByte(this.allWeapons);
		this.writeByte(opts.special);
		this.writeString(opts.playerName, 33);
		this.writeByte(opts.killMask);
		this.writeByte(0); //unk
		this.writeByte(0); //unk
		this.writeByte(0); //unk
		this.writeByte(opts.limit);
		this.writeByte(opts.seeConf);
		this.writeByte(opts.autoBalance);

		if (opts.password) {
			this.writeString(opts.password, 4);
		} else {
			this.writeDword(0); //Null Password
		}
	}

	log() {
		console.log(`[ PACKET ] -- Room Name: ${this.name}`);
		console.log(`[ PACKET ] -- Room Map: ${this.mapId}`);
		console.log(`[ PACKET ] -- Room Slots: ${this.slots}`);

		if (this.password) {
			console.log(`[ PACKET ] -- Room Password: ${this.password}`);
		}
	}
}

module.exports = CreateRoomPacket;
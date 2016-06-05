const
    Packet          = require('../../util/connection/tcp/packet');
class MyInfoPacket extends Packet {
    constructor (opts) {
        super(opts);
        var self = this;
        
        // Reader Packet
        this.advance(4); // Unknown
        this.advance(1); // Unknown
        this.MyNickname         = this.nextString(33);
        this.exp                = this.nextDword();
        this.rank               = this.nextDword();
        this.advance(4); //rank
        this.gp                 = this.nextDword();
        this.money              = this.nextDword();

        this.nextDword(); //ClanId
        this.nextDword(); //ClanNameColor
        this.nextDword(); //unk
        this.nextDword(); //unk
        this.nextWord(); //unk
        this.nextByte(); //color name
        this.advance(17); //clan name
        this.nextWord(); //clan rank
        this.nextByte(); //clan logo1
        this.nextByte(); //clan logo2
        this.nextByte(); //clan logo3
        this.nextByte(); //clan logo4
        this.nextByte(); //clan color

        this.nextByte(); //unk
        this.nextDword(); //unk
        this.nextDword(); //unk
        this.nextDword(); //unk

        this.fights = this.nextDword();
        this.wins   = this.nextDword();
        this.losses = this.nextDword();
        this.nextDword(0);
        this.kills  = this.nextDword();
        this.serialWins = this.nextDword();
        this.deaths = this.nextDword();
        this.nextDword(); //unk
        this.kdp = this.nextDword();
        this.escapes = this.nextDword();
        this.seasonFights = this.nextDword();
        this.seasonWins = this.nextDword();
        this.seasonLosses = this.nextDword();
        this.nextDword();
        this.seasonKills = this.nextDword();
        this.seasonSeriaWins = this.nextDword();
        this.seasonSeriaDeaths = this.nextDword();
        this.nextDword();
        this.seasonKdp = this.nextDword();
        this.seasonEscapes = this.nextDword();

        this.equipment = {};
        this.equipment.red = this.nextDword();
        this.equipment.blue = this.nextDword();
        this.equipment.head = this.nextDword();
        this.equipment.beret = this.nextDword();
        this.equipment.dino = this.nextDword();
        this.equipment.prim = this.nextDword();
        this.equipment.pistol = this.nextDword();
        this.equipment.melee = this.nextDword();
        this.equipment.throwing = this.nextDword();
        this.equipment.bomb = this.nextDword();
    }
    
    getInfo () {
        var info = {
            exp: this.exp, 
            nickname: this.getNickname(),
            money: this.money, 
            gp: this.gp, 
            rank: this.rank,
            fights: this.fights, 
            wins: this.wins, 
            losses: this.losses,
            kills: this.kills, 
            deaths: this.deaths
        };
        return info;
    }
    
    getNickname () {
        return this.MyNickname;
    }

    getEquipment() {
        return this.equipment;
    }

    log () {
        console.log(`[ PACKET ] --- My NickName: ${this.MyNickname}`);
        console.log(`[ PACKET ] --- Money: ${this.money}`);
        console.log(`[ PACKET ] --- Exp: ${this.exp}`);
        console.log(`[ PACKET ] --- Primary Weapon: 0x${this.getEquipment().prim.toString(16)}`);
        console.log(`[ PACKET ] --- Sub Weapon: 0x${this.getEquipment().pistol.toString(16)}`);
        console.log(`[ PACKET ] --- Melee Weapon: 0x${this.getEquipment().melee.toString(16)}`);
        console.log(`[ PACKET ] --- Throw Weapon: 0x${this.getEquipment().throwing.toString(16)}`);
    }
}

module.exports = MyInfoPacket;
const
    Packet          = require('../../util/connection/tcp/packet');

class BattlePreparationPacket extends Packet {
    constructor (opts) {
        super(opts);
        var self = this;

        // Reader Packet
        this.advance(4); //IsFighting
        this.slot = this.nextDword();
        this.advance(1); //Type server

        this.leaderIP           = this.nextIP();
        this.leaderPort         = this.nextWord();
        this.leaderLocalIP      = this.nextIP();
        this.leaderLocalPort    = this.nextWord();
        this.advance(1); //Unknown
        this.ip                 = this.nextIP();
        this.port               = this.nextWord();
        this.localIP            = this.nextIP();
        this.localPort          = this.nextWord();
        this.advance(1); //Unkwnon
        this.serverIP           = this.nextIP();
        this.serverPort         = this.nextWord();
        
        this.infoBattle = [];
        this.infoBattle.push(this.nextDword());
        this.infoBattle.push(this.nextDword());
    }

    getNickname () {
        return this.MyNickname;
    }
    
    getLocalServer() {
        var server = {
            ip: this.localIP,
            port: this.localPort
        };
        return server;
    }
    
    getBattleServer() {
        var server = {
            ip: this.serverIP,
            port: this.serverPort
        };
        return server;
    }
    
    getInfoBattle() {
        return this.infoBattle;
    }
    
    getSlot() {
        return this.slot;
    }

    log () {
        console.log(`[ PACKET ] --- Leader: ${this.leaderIP}:${this.leaderPort}`);
        console.log(`[ PACKET ] --- Self: ${this.ip}:${this.port}`);
        console.log(`[ PACKET ] --- Server: ${this.serverIP}:${this.serverPort}`);
        console.log(`[ PACKET ] --- Slot: ${this.slot}`);
        console.log(`[ PACKET ] --- InfoBattle: ${this.infoBattle[0]}, ${this.infoBattle[1]}`);
    }
}

module.exports = BattlePreparationPacket;
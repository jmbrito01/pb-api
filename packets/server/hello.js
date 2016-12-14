const
    Packet = require('../../util/connection/tcp/packet');

class HelloPacket extends Packet {
    constructor (opts) {
        super(opts);
        this.conn = opts.conn;
        // Read
        this.nextWord(); //unk
        this.countServer = this.nextDword();
        this.advance(132); //Unk
        this.hash        = this.nextWord();
        this.advance(8); //Unk
        this.majorVersion= this.nextByte();
        this.minorVersion= this.nextWord();
        this.advance(2);
        this.sessionId   = this.nextWord();
        this.sessionId   = this.nextDword();
        this.ip          = this.nextIP();
        this.cryptoKey   = this.nextWord();
        this.hash        = this.nextWord();
        this.advance(11); // Array Byte fill 0x01 0x05
        this.countServer = this.nextDword();
        this.totalonline = 0;

        // Read Server 
        for (let i = 0; i < this.countServer;i++)
        {
            this.nextDword(); //Unknown
            var server = {};
            server.id = i;
            server.ip = this.nextIP();
            server.port = this.nextWord();
            server.type = this.nextByte();
            server.max = this.nextWord();
            server.online = this.nextDword();
            this.totalonline += server.online;
            // OBS: Server 0 = Ghost (AuthServer)
            this.conn.addGameServer(server);
        }
        this.advance(15); // Unknown
        
        // Configure
        this.conn.setSessionId(this.sessionId);
        this.conn.setHash(this.hash);
        var shiftSize = ((this.conn.getSessionId() + this.cryptoKey) % 7) + 1;
        this.conn.setShiftSize(shiftSize);
    }

    log () {
        console.log(`[ PACKET ] --- SessionId: ${this.conn.getSessionId()}`);
        console.log(`[ PACKET ] --- My IP: ${this.ip}`);
        console.log(`[ PACKET ] --- CryptoKey: ${this.cryptoKey}`);
        console.log(`[ PACKET ] --- ShiftSize: ${this.conn.getShiftSize()}`);
        console.log(`[ PACKET ] --- Hash: ${this.conn.getHash()}`);
        console.log(`[ PACKET ] --- Server count: ${this.countServer-1}`);
        console.log(`[ PACKET ] --- Total Onlines: ${this.totalonline}`);
    }

}

module.exports = HelloPacket;
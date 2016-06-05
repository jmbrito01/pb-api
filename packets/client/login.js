const
    Packet = require('../../util/connection/tcp/packet');

class LoginPacket extends Packet {
    constructor (opts) {
        super(opts);

        //Write buffer data
        var unk1 = new Buffer([0x09]),
            unk2 = new Buffer([
                0x00, 0xFF, 0x3C, 0x45, 0xAA, 0x06, 0x00, 0x00, 0x00, 0xC0, 0xA8, 0x58, 0xD5, 0x23, 0x65,
                0x78, 0x00, 0x28, 0x1D, 0x00, 0x78, 0x33, 0x63, 0x61, 0x61, 0x34, 0x65, 0x39, 0x33, 0x66,
                0x62, 0x34, 0x30, 0x32, 0x36, 0x30, 0x36, 0x63, 0x30, 0x34, 0x61, 0x33, 0x30, 0x61, 0x31,
                0x34, 0x62, 0x31, 0x32, 0x63, 0x66, 0x33, 0x61
            ]),//0x35
            unk3 = new Buffer([
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00
            ]);//0x25
        this.writeByte(opts.gameVersion[0]); // Write Version Game (Bc.log)
        this.writeWord(opts.gameVersion[1]);
        this.writeWord(opts.gameVersion[2]);
        this.write(unk1, unk1.length);//0x01
        this.writeByte(opts.username.length + 1);
        this.writeByte(opts.password.length + 1);
        this.write(new Buffer(opts.username, 'ascii'), opts.username.length + 1);
        this.write(new Buffer(opts.password, 'ascii'), opts.password.length + 1);
        this.write(unk2, unk2.length);// Mac encripted in Launcher Socket and Send to game by CreateProcess parameter.
        this.write(unk3, unk3.length);// Added (MD5) in last update
    }

    getUsername () {
        return this.getOptions().username;
    }

    getPassword () {
        return this.getOptions().password;
    }

    log () {
        console.log(`[ PACKET ] --- Username: ${this.getUsername()}`);
        console.log(`[ PACKET ] --- Password: ${this.getPassword()}`);
    }
}

module.exports = LoginPacket;
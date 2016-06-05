const
    Packet          = require('../../util/connection/tcp/packet'),
    loginResults    = require('../const/login_results.json');

class AfterLoginPacket extends Packet {
    constructor (opts) {
        super(opts);
        var self = this;
        
        // Reader Packet
        this.resultId = this.nextDword();
        this.advance(1);
        this.accountId = this.nextDouble();
        this.lastLoginSize = this.nextByte();
        this.lastLogin = this.nextString(this.lastLoginSize);
        opts.conn.setAccountId(this.accountId);
        
        // Configure Packet
        this.resultId = (this.resultId == 0 ? 0 : this.resultId - 2147483900);
        loginResults.forEach(function (each) {
            if (each.id === self.resultId) {
                self.result = each;
            }
        });
        this.result = this.result || { id: this.resultId, text: "UNKNOWN_RESPONSE" + this.resultId.toString() };
    }
    
    log () {
        console.log(`[ PACKET ] --- Login Result: ${this.getLoginResultText()}`);
        console.log(`[ PACKET ] --- Account Id: ${this.accountId}`);
        console.log(`[ PACKET ] --- Last Login: ${this.lastLogin}`);
    }
    
    getAccountId() {
        return this.accountId;
    }
    
    getLoginResult () {
        return this.resultId;
    }
    
    getLoginResultText () {
        var self = this;
        var text = null;
        loginResults.forEach(function (each) {
            if (each.id === self.getLoginResult()) {
                text = each.text;
            }
        });
        return text;
    }
}

module.exports = AfterLoginPacket;
const
    Gync                = require('gync'),
    EventEmitter        = require('../util/eventEmitter'),
    TCPConnection       = require('../util/connection/tcp'),
    Packet              = require('../util/connection/tcp/packet');


/**
 * Class for handling authentification with the pointblank auth server
 */
class PBAuth extends EventEmitter {
    /**
     * Creates a PBAuth instance
     * @param {Object} [opts] - Auth Option object containing server and port for connection
     */
    constructor(opts) {
        super(opts);
        this.opts = opts;
        this.connected = false;
        this.authenticated = false;
    }

    /**
     * Connects to the auth server set in your options
     * @returns {Promise}
     */
    connect() {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.conn = new TCPConnection({
                ip: self.opts.auth.server,
                port: self.opts.auth.port
            });

            self.conn.on('packet', function (packet) {
                var packetName = Packet.protocolIdToName(packet.getProtocolID());
                if (packetName === 'PROTOCOL_BASE_SERVERLIST_ACK') {
                    self.connected = true;
                    self.triggerEvent('connect');
                    resolve();
                }

            });
        });
    }

    /**
     * Disconnects from the authentication server
     * @returns {Promise}
     */
    disconnect() {
        return this.conn.sendKnownPacket("PROTOCOL_BASE_USER_LEAVE_REQ");
    //.then(this.conn.destroy());
    }

    /**
     * Authenticates an account with the server
     * @param {String} username - The account's username
     * @param {String} password - The account's password
     * @returns {Promise}
     */
    authenticate(username, password) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (!self.connected) {
                reject(new Error('Not connected'));
            }
            Gync.run(function * () {
                var result = yield self.conn.sendKnownPacket('PROTOCOL_BASE_LOGIN_REQ', {
                    username,
                    password,
                    gameVersion: self.opts.gameVersion
                });
                if (result.getLoginResult() !== 0) {
                    //Login Failed
                    self.disconnect();
                    return reject(result.getLoginResultText());
                }
                //Login Successfull

                self.accountId = result.getAccountId();

                //Retrieve info
                var myInfo = yield self.conn.sendKnownPacket("PROTOCOL_BASE_GET_MYINFO_REQ");
                self.nickname = myInfo.getNickname();
                self.equipment = myInfo.getEquipment();
                self.info = myInfo.getInfo();
                console.log(`[ USER INFO ] Nickname: ${self.nickname}`);
                // Get My friends
                yield self.conn.sendKnownPacket("PROTOCOL_BASE_GET_MYFRIENDS_REQ");
                self.authenticated = true;
                self.triggerEvent('authenticate');
                resolve();
            });
        });
    }

	/**
	 * Retrieves the equipments of the logged user
     * @returns {*}
     */
    getEquipment() {
        return this.equipment;
    }

    /**
     * Retrieves the logged user's nickname
     * @returns {String} nickname
     */
    getNickname() {
        return this.nickname || null;
    }

	/**
	 * Retrieves the character informations
     * @returns {Object}
     */
    getInfo() {
        return this.info;
    }

    /**
     * Retrieves the logged user's account id
     * @returns {Number} accountId
     */
    getAccountId() {
        return this.accountId;
    }

    /**
     * Retrives a game server
     * @param {Number} s - The server index
     * @returns {Object} gameServer
     */
    getGameServer(s) {
        return this.conn.servers[s];
    }

	/**
	 * Retrieves the size of servers available for connection
     * @returns {Number}
     */
    getGameServerCount() {
        return this.conn.servers.length;
    }
}

module.exports = PBAuth;
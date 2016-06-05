const
    Gync                = require('gync'),
    Timer               = require('../util/timer'),
    PBBattle            = require('./battle'),
    EventEmitter        = require('../util/eventEmitter'),
    TCPConnection       = require('../util/connection/tcp'),
    Packet              = require('../util/connection/tcp/packet');

/**
 * Class for handling communication with the pointblank game server
 */
class Game extends EventEmitter {
    /**
     * Creates a new instance of Game
     * @param [opts] - Options object containing username and accountId of the logged user
     */
    constructor(opts) {
        super(opts);
        this.opts = opts;
        this.equipment = opts.equipment;
        
        this.state = 'idle';
        this.bombPlanted = false;
        
        this.on('connect', this.onConnect.bind(this));
        setTimeout(this.onHeartbeat.bind(this), 60000);
    }
    
    onConnect() {

    }
    
    onHeartbeat() {
        //this.conn.sendKnownPacket('PROTOCOL_BASE_HEARTBEAT_REQ');
        //setTimeout(this.onHeartbeat.bind(this), 60000);
    }
    

    /**
     * Sets the game state
     * @param state - The new state for game
     */
    setState(state) {
        this.state = state;
    }

    /**
     * Disconnects from the game server
     */
    disconnect() {
        this.conn.sendKnownPacket('PROTOCOL_EXIT_GAME_REQ');
        this.conn.destroy();
        this.setState('idle');
    }

    /**
     * Connects to a game server
     * @param server - The server to connect, an object containing ip and port
     * @returns {Promise}
     */
    connect(server) {
        var self = this;
        //TODO: Check if state is idle before connecting
        return new Promise(function (resolve, reject) {
            self.conn = new TCPConnection({
                ip: server.ip,
                port: server.port
            });

            self.conn.on('packet', self.onPacket.bind(self));
            self.conn.on('ready', function () {
                self.setState('ready');
                Gync.run(function * () {
                    yield self.conn.sendKnownPacket('PROTOCOL_BASE_AUTHENTICATE_GAME_REQ', {
                        accountId: self.opts.accountId,
                        username: self.opts.username
                    });
                    // Get List Channel
                    yield self.conn.sendKnownPacket('PROTOCOL_BASE_GET_CHANNELLIST_REQ');
                    self.setState('channellist');

                }).then(resolve, reject);
            });
            
        });
    }
    
    onPacket(packet) {
        var self = this;
        var packetName = Packet.protocolIdToName(packet.getProtocolID());
        
        if (packetName === 'PROTOCOL_BATTLE_ROOM_INFO_ACK' && !(this.battle)) {
            //Battle is about to start
            this.conn.sendKnownPacket('PROTOCOL_BASE_BATTLE_STARTING_REQ', {
                map: packet.getMapName(packet.getMapId())
            });
            this.conn.sendKnownPacket('PROTOCOL_BATTLE_PREPARATION_REQ', {
                mapId: packet.getMapId()
            });

        } else if (packetName === 'PROTOCOL_BATTLE_PREPARATION_ACK') {

            this.setState('battle');

            this.battle = new PBBattle({
                accountId: this.opts.accountId,
                slot: packet.getSlot()
            });
            
            this.slot = packet.getSlot();
            
            this.battle.connect({
                server: packet.getBattleServer(),
                port: packet.getLocalServer().port,
                infoBattle: packet.getInfoBattle()
            });
            
            this.battle.on('connect', function () {
                self.conn.sendKnownPacket("PROTOCOL_BATTLE_STARTBATTLE_REQ");
            })
        } else if (packetName === 'PROTOCOL_BATTLE_BOMB_TAB_ACK') {
            console.log('[ GAME ] BOMB PLANTED ON ZONE ', packet.getBombZone());
            this.bombPlanted = true;
        } else if (packetName === 'PROTOCOL_BATTLE_BOMB_UNTAB_ACK') {
            console.log(`[ GAME ] BOMB DEFUSED BY PLAYER ${packet.getDefuserSlot()}`);
            this.bombPlanted = false;
        } else if (packetName === 'PROTOCOL_BATTLE_FRAG_INFO_ACK') {
            if (packet.getVictimId() === this.slot) {
                setTimeout(function () {
                    self.respawn({
                        equipment: self.equipment,
                        slot: self.slot
                    });
                }, 3000);
            }
        }
    }

    /**
     * Sends a chat message to the server
     * @param msg - The message content
     * @param [type] - The message type (1 = All, 4 = Team)
     * @returns {Promise}
     */
    sendChatMessage(msg, type) {
        if (this.state === 'lobby' || this.state === 'room') {
            return this.conn.sendKnownPacket('PROTOCOL_MESSAGE_CHAT_REQ', {
                message: msg,
                messageType: type
            });
        } else {
            throw "INVALID";
        }
    }
    
    sendChatWhisper(nickname, message) {
        //TODO: Fix bugs of this function
        return this.conn.sendKnownPacket('PROTOCOL_MESSAGE_CHAT_WHISPER_REQ', {nickname, message});
    }

    /**
     * Sends the GO message to the server
     * @returns {Promise}
     */
    readyRoom() {
        if (this.state === 'room') {
            return this.conn.sendKnownPacket('PROTOCOL_BATTLE_READYBATTLE_REQ');
        } else {
            throw "INVALID";
        }
    }
    
    getRoomList() {
        if (this.state !== 'lobby') {
            return reject('Invalid state');
        }
        return this.conn.sendKnownPacket('PROTOCOL_LOBBY_GET_ROOMLIST_REQ');

    }

    /**
     * Changes the user's team.
     * @param team - the new team to join
     * @returns {Promise}
     */
    changeTeam(team) {
        if (this.state === 'room') {
            return this.conn.sendKnownPacket('PROTOCOL_ROOM_CHANGE_SLOT_REQ', {team});
        } else {
            throw "INVALID";
        }
    }

    /**
     * Enters in a channel
     * @param channel - The channel to enter
     * @returns {Promise}
     */
    enterChannel(channel) {
        var self = this;
        return Gync.run(function * () {
            // Enter in Channel
            yield self.conn.sendKnownPacket('PROTOCOL_BASE_ENTER_CHANNELSELECT_REQ', {
                channel: self.formatChannel(channel)
            });

            yield self.conn.sendKnownPacket('PROTOCOL_LOBBY_ENTER_REQ');
            // Check if the nick is already defined.
            /*if (self.opts.nickname.length <= 1) {
             // Create Nickname to account
             yield self.game.sendKnownPacket("PROTOCOL_LOBBY_CREATE_NICK_NAME_REQ", {
             Nickname: self.opts.username
             });
             }*/

            self.setState('lobby');
        });
    }

    /**
     * Leaves the current room
     * @returns {Promise}
     */
    leaveRoom() {
        var self = this;
        if (self.state === 'room') {
            return new Promise(function (resolve) {
                self.sendKnownPacket('PROTOCOL_LOBBY_LEAVE_ROOM_REQ').then(function() {
                    self.setState('lobby');
                    resolve();
                }, reject);
            })
        } else {
            throw "NOT VALID";
        }
    }

    /**
     * Joins a room
     * @param room - The id of the room
     * @returns {Promise}
     */
    enterRoom(room) {
        var self = this;
        if (self.state === 'lobby') {
            //enterRoom
            self.setState('room');
            return self.conn.sendKnownPacket('PROTOCOL_LOBBY_JOIN_ROOM_REQ', {room});
        } else if (self.state === 'room') {
            //Exit room && enterRoom
            self.setState('room');
            return self.leaveRoom()
                .then(self.enterRoom(room));
        } else {
            throw "NOT VALID";
        }
    }

	/**
	 * creates a new room 
     * @param opts
     * @returns {Promise}
     */
    createRoom(opts) {
        var self = this;
        return Gync.run(function* () {
            if (self.state === 'lobby') {
                //create Room
                var result = yield self.conn.sendKnownPacket('PROTOCOL_LOBBY_CREATE_ROOM_REQ', opts);
                self.setState('room');
                return result;
            } else if (self.state === 'room') {
                yield self.leaveRoom();
                return self.conn.sendKnownPacket('PROTOCOL_LOBBY_CREATE_ROOM_REQ', opts);
            } else {
                throw "NOT_VALID";
            }
        })
    }

	/**
	 * Plants the bomb in the battle
     * @param opts - zone, slot, pos(as a vector {x,y,z})
     * @returns {Promise}
     */
    plantBomb(opts) {
        //TODO: Not tested
        if (this.state === 'battle' && this.bombPlanted === false) {
            return this.conn.sendKnownPacket('PROTOCOL_BATTLE_BOMB_TAB_REQ', {
                zone: opts.zone,
                slot: opts.slot,
                pos: opts.pos
            });
        } else {
            throw "INVALID STATE";
        }
    }

	/**
     * Defuses the bomb in the battle
     * @param slot - The slot of the player who disarmed it.
     * @returns {Promise}
     */
    defuseBomb(slot) {
        //TODO: Not tested
        if (this.state === 'battle' && this.bombPlanted) {
            return this.conn.sendKnownPacket('PROTOCOL_BATTLE_BOMB_UNTAB_REQ', {
                slot: opts.slot
            });
        } else {
            throw "INVALID STATE";
        }
    }

	/**
	 * Respawn a chara player
     * @param opts - Equipment, slot
     * @returns {Promise}
     */
    respawn(opts) {
        if (this.state === 'battle') {
            return this.conn.sendKnownPacket('PROTOCOL_BATTLE_RESPAWN_REQ', {
                equipment: opts.equipment,
                slot: opts.slot
            });
        } else {
            throw "INVALID STATE";
        }
    }

    /**
     * Formats the channel to the numbers the server is used to handle.
     * @param c - The channel to be converted.
     * @returns {number}
     */
    formatChannel(c) {
        return (c % 11)-1;
    }
}

module.exports = Game;
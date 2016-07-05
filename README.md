# pb-api

### What's PB API?
PB API is a library that simulates a point blank client to
the game server (Only the connection).It can authenticates, create rooms, send messages,
start battles and many more.
This library was written based in the **game version
1.15.37 and UDP version 1012.12**.

### Disclaimer
This analysis of the PointBlank protocol is for educational
purposes only and the authors are not responsible for any people
that tries to reproduce what is shown here.
If you are not aware of the risks involving exploiting
some informations described in commercial servers
**we discourage you to use it.**


### The protocol
To know more about the PointBlank connection protocol you should check out
our [documentation](https://github.com/jmbrito01/pb-api/blob/master/documentation).

### Installation
To install you can use the node package manager (npm) with the
command:
`npm install pb-api`

or clonning this repository

### Examples
Simple authentication:
```
var PBAuth      = require('pb-api').Authentication;

var auth = new PBAuth({
	auth: {
		server: 'AUTH_SERVER_IP',
		port: 0 //AUTH_SERVER_PORT
	},
	gameVersion: [0, 0, 0] //GAME_VERSION
});

auth.connect()
    .then(auth.authenticate('username', 'password'))
    .then(
        //On Success
        function () {
            console.log(`My Account Id: ${auth.getAccountId()}`);
            console.log(`Nickname: ${auth.getNickname()}`);
        },
        //On Error
        function () {
            console.log(`Authentication error`);
        }
    );
```
This repository contains more examples located in the examples path.

### Functionalities

##### Auth
* **authenticate:** Authenticates your account and password sending
PROTOCOL_BASE_LOGIN_REQ after that it sends the PROTOCOL_BASE_GET_MYINFO_REQ
and PROTOCOL_BASE_GET_MYFRIENDS_REQ to load the user's
informations
* **disconnect:** Sends PROTOCOL_BASE_USER_LEAVE_REQ to the server
to finish the connection

##### Game
* **connect:** Authenticates with the game server by sending
PROTOCOL_BASE_AUTHENTICATE_GAME_REQ and after that
PROTOCOL_BASE_GET_CHANNELLIST_REQ
* **enterChannel:** Enters in channel by sending PROTOCOL_BASE_ENTER_CHANNELSELECT_REQ
and after PROTOCOL_LOBBY_ENTER_REQ to enter in the lobby
* **enterRoom:** Enters in a room (if you're in the lobby) by
sending the packet PROTOCOL_LOBBY_JOIN_ROOM_REQ
* **createRoom:** Creates a room by sending PROTOCOL_LOBBY_CREATE_ROOM_REQ
* **getRoomList:** Retrieves the list of rooms in this lobby
by sending PROTOCOL_LOBBY_GET_ROOMLIST_REQ
* **leaveRoom:** Leaves a room by sending PROTOCOL_LOBBY_LEAVE_ROOM_REQ
* **sendChatMessage:** Sends a chat message by sending the protocol
PROTOCOL_MESSAGE_CHAT_REQ
* **readyRoom:** Sets the account as ready in the room with the packet
PROTOCOL_BATTLE_READYBATTLE_REQ
* **changeTeam:** Changes the accounts team in the room
by sending PROTOCOL_ROOM_CHANGE_SLOT_REQ
* **Battle Start:** When the battle is about to start, by default the
connection sends PROTOCOL_BASE_BATTLE_STARTING_REQ and PROTOCOL_BATTLE_PREPARATION_REQ
to enable your user to join the battle.
* **plantBomb:** When you are in battle you still use the Game connection
for some actions, one of them is planing the bomb, by sending the
packet PROTOCOL_BATTLE_BOMB_TAB_REQ
* **defuseBomb:** If theres a bomb planted you can send the defuse packet
 PROTOCOL_BATTLE_BOMB_UNTAB_REQ

##### Battle
* **connect:** By sending a packet with protocol id 65 (INTRUDE_BATTLE) we can
start the connection with the UDP and start the battle. If this connection is
not made, the bot wont take any hits.

##### More Detailed informations
To see a more well written documentation run `gulp docs` in the
project so that jsdoc can document the classes for you, after it
finishes just access the website generated at the path named `docs`.

### Contribute
We encourage you to contribute to this repository, today the two things we believe
is most needed are better documentations of the protocol and to finish the battle protocol
that we only started, we want to understand further how it works so that we can simulate an
entire battle clientlessly.

### License
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
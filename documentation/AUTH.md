# Authentication Protocol

### Introduction
This documentation is aimed for fully understanding how the authentication 
protocol works on the PointBlank game.

### Observations
The sourcecode is not up to date with the latest point blank version
because we did not found how to encrypt our MAC address, when it was updated
we were studying the battle server and did not implemented it yet, so that unk2 in the
code is our MAC encrypted that we got from the parameters of the process.

### Packet list
| Packet Name | Packet Id
|--| --|
| PROTOCOL_BASE_SERVERLIST_ACK | 2049|
| PROTOCOL_BASE_LOGIN_REQ | 2561|
| PROTOCOL_BASE_LOGIN_ACK | 2564|
| PROTOCOL_BASE_GET_MYINFO_REQ | 2565|
| PROTOCOL_BASE_GET_MYINFO_REQ | 2566|
| PROTOCOL_BASE_GET_MYFRIENDS_REQ | 2567|
| PROTOCOL_BASE_GET_MYFRIENDS_ACK | 274|
| PROTOCOL_BASE_GET_CHANNELLIST_REQ | 2571|
| PROTOCOL_BASE_GET_CHANNELLIST_ACK | 2572|
| PROTOCOL_BASE_ENTER_CHANNELSELECT_REQ | 2573|
| PROTOCOL_BASE_ENTER_CHANNELSELECT_ACK | 2574|
| PROTOCOL_BASE_USER_LEAVE_REQ | 2577|
| PROTOCOL_BASE_USER_LEAVE_ACK | 2578|


### The Connection
As soon as you connect with the server it sends the **PROTOCOL_BASE_SERVERLIST_ACK** which contains the basic informations you'll
need to use for the conversation. You can check how it was implemented
in [packets/server/hello.js](https://github.com/jmbrito01/pb-api/blob/master/packets/server/hello.js)

In the version of this documentation this is what
it sends:

| Location  | Size (bytes)  | Name  | Description |
|----|----|----|----|
| 0x00       | 4             | sessionId | you'll need it to authenticate with the game server later|
| 0x04       | 4             | ip | Your IP
| 0x08       | 2             | cryptoKey | This is the key for you to use to encrypt your messages, but remember, the server never encrypts theirs. |
| 0x10       | 2             | hash | this is your connection hash, you'll use it later aswell |
| 0x12       | 11            | unknown | We don't know exacly what this is, it is an array of bytes filled with 0x1 and 0x5.|
| 0x1D       | 4             | serverCount | The number of servers available for connection |

After this informations the server sends you informations about all the
servers like an array with of `ServerInfo`, this object can be described as:

| Location  | Size (bytes)  | Name  | Description |
|----|----|----|---- |
| 0x00      | 4             | ip    | The ip of the server |
| 0x04      | 2             | port  | The server port |
| 0x06      | 1             | type  | Server type |
| 0x07      | 2             | maxConnections | The maximum number of online players it can handle |
| 0x09      | 4             | onlinePlayers  | Number of players online in this server |

### The Authentication

After you retrieved all informations needed, it's time to authenticate with
the auth server. For that you'll need to send the **PROTOCOL_BASE_LOGIN_REQ** packet. It is implemented
in [packets/client/login.js](https://github.com/jmbrito01/pb-api/blob/master/packets/client/login.js)

| Location  | Size (bytes)  | Name  | Description |
|----|----|----|----|
| 0x00      | 5             | gameVersion | The game's current version, it can be found in BC.log |
| 0x05      | 1             | unk         | Don't know what it represents, it's always 0x9 |
| 0x06      | 1             | usernameLength | length of the username (null-terminated) |
| 0x07      | 1             | passwordLength | length of the password (null-terminated) |
| 0x08      | usernameLength| username       | account username |
| after the username   | passwordLength| password       | password of the account |
| after the password  | 53        | encMAC | MAC encrypted in the launcher, the launcher encrypts it and sends as a parameter of the proces in CreateProcess |
| after the MAC | 37 | unk | A bunch of 00's, don't know what it represents |

If you did everything right you should recieve the packet **PROTOCOL_BASE_LOGIN_ACK** which contains
the result of the login with some other userful informations, it's implementation
is located in [packets/server/login.js](https://github.com/jmbrito01/pb-api/blob/master/packets/server/login.js)

| Location  | Size (bytes)  | Name  | Description |
|----|----|----|----|
| 0x00      | 4             | resultId | The result of the login request, the list of possible results can be found in [packets/const/login_results.json](https://github.com/jmbrito01/pb-api/blob/master/packets/const/login_results.json)|
| 0x04      | 1             | unk       | |
| 0x05      | 8             | accountId | Very important, will be used later|
| 0x0D      | 1             | lastLoginSize | length of the username of the last person to login|
| 0x0F      | lastLoginSize | lastLogin | the last user to login to the server (We still dont know why they send that)|

If you only authenticate the server will soon disconnect you, to maintain your connection
you'll need to send after the authentication 2 more packets requesting some informations
about the account, those packets are the **PROTOCOL_BASE_GET_MYINFO_REQ** and **PROTOCOL_BASE_GET_MYFRIENDS_REQ**,
one retrieves a bunch of informations about your accounts and the other about your friends.
If you searched for them in the source code you probably didn't found any files for it. Thats because those packets
are what we called `clean` packets, they only send the header of the packet and no content ( because there's nothing to send ).


And after them you'll receive the **PROTOCOL_BASE_GET_MYFRIENDS_ACK** and **PROTOCOL_BASE_GET_MYINFO_ACK**, those are
not clean but we didn't try to get the MYFRIENDS because it wasn't our priority, but the myInfo is located at [packets/server/MyInfo.js](https://github.com/jmbrito01/pb-api/blob/master/packets/server/MyInfo.js).

After receiving those packets you have finished your conversation with the
auth server and it now ready to connect with the game server ( those you received in the first
packet ). You can even disconnect from the auth server. If you want to exit gracefully
you can send the **PROTOCOL_BASE_USER_LEAVE_REQ**. It's a clean packet and will make the server
disconnect from you.
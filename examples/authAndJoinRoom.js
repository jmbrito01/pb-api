var PBAuth      = require('..').Authentication;
var PBGame      = require('..').Game;

var auth = new PBAuth({
	auth: {
		server: 'AUTH_SERVER_IP',
		port: 0 //AUTH_SERVER_PORT
	},
	gameVersion: [0, 0, 0] //GAME_VERSION
});

auth.connect().then(auth.authenticate('username', 'password')).then(
	//On Success
	function () {
		var game = new PBGame({
			username: 'username',
			accountId: auth.getAccountId()
		});
		auth.disconnect()
			.then(game.connect(
				auth.getGameServer(1) //Joins server 1
			))
			.then(game.enterChannel(8)) //Joins channel 8
			.then(game.enterRoom(1)) //Room id 1
			.then(game.readyRoom()); //Get ready
	},
	//On Error
	function () {
		console.log(`Authentication error`);
	}
);
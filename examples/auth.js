var PBAuth      = require('..').Authentication;

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
		console.log(`My Account Id: ${auth.getAccountId()}`);
		console.log(`Nickname: ${auth.getNickname()}`);
	},
	//On Error
	function () {
		console.log(`Authentication error`);
	}
);
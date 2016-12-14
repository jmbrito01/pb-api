const
    PBAuth              = require('./pointblank/auth'),
    PBGame              = require('./pointblank/game');

module.exports = {
    Authentication: PBAuth,
    Game: PBGame
};

var auth = new PBAuth({
    auth: {
        server: '201.77.235.143',
        port: 39190 //AUTH_SERVER_PORT
    },
    gameVersion: [1, 15, 37] //GAME_VERSION
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
const
	TCPConnection       = require('../util/connection/tcp');

let connection = new TCPConnection({
	ip: '201.77.235.143',
	port: 39190
});

connection.on('packet', function (packet) {
	console.log(`[PACKET] Packet received: ${packet.getProtocolID()}`);
	let data = Array.from(packet.getData()).map(each => {
		return `0x${each.toString(16)}`;
	});
	console.log(`[PACKET] Buffer: ${data.join(' ')}`);
});


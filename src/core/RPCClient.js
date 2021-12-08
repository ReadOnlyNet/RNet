const jayson = require('jayson');

class RPCClient {
	constructor(rnet, host, port) {
		this.rnet = rnet;
		this.client = jayson.client.http({
			host,
			port,
		});

		return this.client;
	}
}

module.exports = RPCClient;

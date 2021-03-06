/* eslint-disable no-unused-vars */
const { Server } = require('./rpc');
const util = require('util');
const Diagnostics = require('./utils/Diagnostics');

class RPCServer extends Server {
	constructor(rnet) {
		super();

		this.rnet = rnet;
		this.id = rnet.clientOptions.clusterId;
		this.logger = rnet.logger;

		const host = rnet.config.rpcHost || 'localhost';
		const port = 30000 + parseInt(this.id, 10);

		let methods = {
			rlreset: this.rlreset.bind(this),
			debug: this.debug.bind(this),
			diagnose: this.diagnose.bind(this),
		};

		// wrap methods for auth
		for (let [key, fn] of Object.entries(methods)) {
			methods[key] = this.auth.bind(this, fn);
		}

		this.diagnostics = new Diagnostics(rnet);

		this.init(host, port, methods);
	}

	auth(handler, payload, cb) {
		if (payload) {
			if (!payload.token || payload.token !== (this.rnet.config.rpcToken)) {
				return cb(`Invalid token.`);
			}

			this.logger.debug('[RPC] Auth Passed.');
			return handler(payload, cb);
		}
	}

	rlreset(payload, cb) {
		try {
			const guild = this.rnet.client.guilds.get(payload.id);

			this.logger.debug(`[RPC] Clearing guild level rate limits.`);

			Object.keys(this.rnet.client.requestHandler.ratelimits).filter(k => k.includes(guild.id)).forEach(k => {
				this.rnet.client.requestHandler.ratelimits[k]._queue = [];
				this.rnet.client.requestHandler.ratelimits[k].remaining = 1;
				this.rnet.client.requestHandler.ratelimits[k].check(true);
				delete this.rnet.client.requestHandler.ratelimits[k];
			});

			this.logger.debug(`[RPC] Clearing channel level rate limits.`);
			for (let channel of guild.channels.values()) {
				Object.keys(this.rnet.client.requestHandler.ratelimits).filter(k => k.includes(channel.id)).forEach(k => {
					this.rnet.client.requestHandler.ratelimits[k]._queue = [];
					this.rnet.client.requestHandler.ratelimits[k].remaining = 1;
					this.rnet.client.requestHandler.ratelimits[k].check(true);
					delete this.rnet.client.requestHandler.ratelimits[k];
				});
			}

			return cb(null, 'Success!');
		} catch (err) {
			return cb(err);
		}
	}

	async debug(payload, cb) {
		let rnet = this.rnet,
			client = rnet.client,
			config = rnet.config,
			models = rnet.models,
			redis = rnet.redis,
			utils = rnet.utils,
			result;

		try {
			result = eval(payload.code);
		} catch (e) {
			result = e;
		}

		try {
		if (result && result.then) {
			try {
				result = await result;
			} catch (err) {
				result = err;
			}
		}

		if (!result) {
			return cb();
		}

		result = result.toString();

		return cb(null, result);
		} catch (err) {
			rnet.logger.error(err);
			return cb(err);
		}
	}

	async diagnose(payload, cb) {
		if (!payload.id || !payload.name) {
			return cb('Invalid arguments.');
		}

		try {
			const result = await this.diagnostics.diagnose(payload.id, payload.name);
			return cb(null, result);
		} catch (err) {
			this.rnet.logger.error(err);
			return cb(err);
		}
	}
}

module.exports = RPCServer;

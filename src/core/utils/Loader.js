'use strict';

const requireReload = require('require-reload');

let context;

class Loader {
	static setRoot(ctx) {
		context = ctx;
	}

	static require(path, ...args) {
		if (!context) throw new Error('Root context not defined');
		return requireReload(context)(path, ...args);
	}

	static loadCommands(rnet) {
		try {
			var CommandCollection = requireReload(context)('./core/collections/CommandCollection');
		} catch (err) {
			return Promise.reject(err);
		}

		try {
			rnet.commands = new CommandCollection(rnet.config, rnet);
		} catch (err) {
			return Promise.reject(err);
		}

		return Promise.resolve();
	}

	static loadModules(rnet) {
		try {
			var ModuleCollection = requireReload(context)('./core/collections/ModuleCollection');
		} catch (err) {
			return Promise.reject(err);
		}

		try {
			if (rnet.modules.unload) {
				rnet.modules.unload();
			}
			rnet.modules = new ModuleCollection(rnet.config, rnet);
		} catch (err) {
			return Promise.reject(err);
		}

		return Promise.resolve();
	}

	static loadManagers(rnet) {
		try {
			var PermissionsManager = requireReload(context)('./core/managers/PermissionsManager');
			var WebhookManager = requireReload(context)('./core/managers/WebhookManager');
		} catch (err) {
			return Promise.reject(err);
		}

		try {
			rnet.permissions = new PermissionsManager(rnet);
			rnet.webhooks = new WebhookManager(rnet);
		} catch (err) {
			return Promise.reject(err);
		}

		return Promise.resolve();
	}

	static loadConfig(rnet) {
		try {
			var config = requireReload(context)('./core/config');
		} catch (err) {
			return Promise.reject(err);
		}

		rnet.config = config;

		return Promise.resolve(config);
	}
}

module.exports = Loader;

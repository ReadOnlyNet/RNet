'use strict';

const Command = Loader.require('./core/structures/Command');
const { RNet } = require('../../core/models');

class GlobalEnable extends Command {
	constructor(...args) {
		super(...args);

		this.aliases      = ['englobal'];
		this.group        = 'Admin';
		this.description  = 'Disable a module or command globally';
		this.usage        = 'englobal [name]';
		this.permissions  = 'admin';
		this.expectedArgs = 1;
	}

	execute({ message, args }) {
		const name = args.join(' ');
		const module = this.rnet.modules.get(name);
		const command = this.rnet.commands.get(name);
		const globalConfig = this.rnet.globalConfig || {};
		const options = { new: true, upsert: true };

		if (!module || !command) {
			return this.sendMessage(message.channel, `Couldn't find module or command ${name}`);
		}

		if (module) {
			globalConfig.modules = globalConfig.modules || {};
			globalConfig.modules[name] = true;
			return RNet.findOneAndUpdate({}, globalConfig, options).then(doc => {
				this.config.global = doc.toObject();
				this.success(message.channel, `Enabled module ${name}`);
			}).catch(err => this.logger.error(err));
		}

		if (command) {
			globalConfig.commands = globalConfig.commands || {};
			globalConfig.commands[name] = true;
			return RNet.findOneAndUpdate({}, globalConfig, options).then(doc => {
				this.config.global = doc.toObject();
				this.success(message.channel, `Enabled command ${name}`);
			}).catch(err => this.logger.error(err));
		}

		return Promise.resolve();
	}
}

module.exports = GlobalEnable;

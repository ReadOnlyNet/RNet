'use strict';

const util = require('util');
const {Command} = require('@rnet.cf/rnet-core');

class UnloadModule extends Command {
	constructor(...args) {
		super(...args);

		this.aliases      = ['unloadmodule', 'unloadmod'];
		this.group        = 'Admin';
		this.description  = 'Unload a module.';
		this.usage        = 'unloadmodule [module]';
		this.permissions  = 'admin';
		this.expectedArgs = 1;
	}

	execute({ message, args }) {
		if (!this.rnet) return false;

		return this.rnet.ipc.awaitResponse('unload', { type: 'modules', name: args[0] })
			.then(data => this.sendCode(message.channel, data.map(d => util.inspect(d)), 'js'))
			.catch(err => this.sendCode(message.channel, err, 'js'));
	}
}

module.exports = UnloadModule;

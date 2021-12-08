'use strict';

const Command = Loader.require('./core/structures/Command');

class Restart extends Command {
	constructor(...args) {
		super(...args);

		this.aliases      = ['restart'];
		this.group        = 'Admin';
		this.description  = 'Restart shards.';
		this.usage        = 'restart';
		this.permissions  = 'admin';
		this.overseerEnabled = true;
		this.expectedArgs = 0;
	}

	execute({ args }) {
		if (!this.rnet) return false;

		if (args.length) {
			this.rnet.ipc.send('restart', args[0]);
			return Promise.resolve();
		}

		this.rnet.ipc.send('restart');
		return Promise.resolve();
	}
}

module.exports = Restart;

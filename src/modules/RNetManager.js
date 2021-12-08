'use strict';

const Module = Loader.require('./core/structures/Module');
const utils = Loader.require('./core/utils');
const { Server, GuildLog } = require('../core/models');
const redis = require('../core/redis');

/**
 * RNetManager module
 * @class RNetManager
 * @extends Module
 */
class RNetManager extends Module {
	constructor() {
		super();

		this.module = 'RNetManager';
		this.description = 'RNet manager.';
		this.core = true;
		this.list = false;
		this.enabled = true;
		this.hasPartial = false;
	}

	static get name() {
		return 'RNetManager';
	}

	guildCreate(guild) {
		if (!this.config.isCore) return;
		const clients = this.globalConfig.clients;
		if (!clients || !clients.length) return;
		for (let client of clients) {
			if (client.userid === this.config.client.id) continue;
			if (guild.members.has(client.userid)) {
				this.client.leaveGuild(guild.id);
			}
		}
	}
}
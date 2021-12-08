'use strict';

const { utils } = require('@rnet.cf/rnet-core');

module.exports = function guildBanAdd(dispatcher, guild, member) {
	if (!dispatcher.rnet.isReady || !guild || !member) return Promise.reject();

	if (dispatcher.config.handleRegion && !utils.regionEnabled(guild, dispatcher.config)) return Promise.reject();

	return new Promise((resolve, reject) => {
		dispatcher.rnet.guilds.getOrFetch(guild.id).then(guildConfig => resolve({
				guild: guild,
				member: member,
				guildConfig: guildConfig,
			})).catch(() => reject());
	});
};

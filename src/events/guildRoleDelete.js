'use strict';

const { utils } = require('@rnet.cf/rnet-core');

module.exports = function guildRoleDelete(dispatcher, guild, role) {
	if (!dispatcher.rnet.isReady || !guild || !role) return Promise.reject();

	if (dispatcher.config.handleRegion && !utils.regionEnabled(guild, dispatcher.config)) return Promise.reject();

	return new Promise((resolve, reject) => {
		dispatcher.rnet.guilds.getOrFetch(guild.id).then(guildConfig => resolve({
				guild: guild,
				role: role,
				guildConfig: guildConfig,
			})).catch(() => reject());
	});
};

'use strict';

const { utils } = require('@rnet.cf/rnet-core');

module.exports = function channelCreate(dispatcher, channel) {
	if (!dispatcher.rnet.isReady || !channel.guild) return Promise.reject();

	if (dispatcher.config.handleRegion && !utils.regionEnabled(channel.guild, dispatcher.config)) return Promise.reject();

	return new Promise((resolve, reject) => {
		dispatcher.rnet.guilds.getOrFetch(channel.guild.id).then(guildConfig => resolve({
				channel: channel,
				guild: channel.guild,
				guildConfig: guildConfig,
			})).catch(() => reject());
	});
};

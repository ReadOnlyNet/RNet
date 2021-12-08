'use strict';

const { utils } = require('@rnet.cf/rnet-core');

module.exports = function voiceChannelJoin(dispatcher, member, channel) {
	if (!dispatcher.rnet.isReady || !member || !channel.guild) return Promise.reject();

	if (dispatcher.config.handleRegion && !utils.regionEnabled(channel.guild, dispatcher.config)) return Promise.reject();

	return new Promise((resolve, reject) => {
		dispatcher.rnet.guilds.getOrFetch(channel.guild.id).then(guildConfig => resolve({
				member: member,
				channel: channel,
				guild: channel.guild,
				guildConfig: guildConfig,
			})).catch(() => reject());
	});
};

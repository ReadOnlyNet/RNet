'use strict';

const { utils } = require('@rnet.cf/rnet-core');

module.exports = function messageReactionAdd(dispatcher, message, emoji, userId) {
	if (!dispatcher.rnet.isReady || (message.author && message.author.bot)) return Promise.reject();
	if (!message.channel.guild) return Promise.reject();

	if (dispatcher.config.handleRegion && !utils.regionEnabled(message.channel.guild, dispatcher.config)) return Promise.reject();

	const guildConfig = dispatcher.rnet.guilds.get(message.channel.guild.id);
	if (guildConfig) {
		return Promise.resolve({
			message: message,
			emoji: emoji,
			userId: userId,
			guild: message.channel.guild,
			guildConfig: guildConfig,
			isAdmin: dispatcher.rnet.permissions.isAdmin(message.author),
		});
	}

	return dispatcher.rnet.guilds.getOrFetch(message.channel.guild.id).then(guildConfig => { // eslint-disable-line
		return {
			message: message,
			emoji: emoji,
			userId: userId,
			guild: message.channel.guild,
			guildConfig: guildConfig,
			isAdmin: dispatcher.rnet.permissions.isAdmin(message.author),
		};
	});
};

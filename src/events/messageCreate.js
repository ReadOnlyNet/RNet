'use strict';

const { utils } = require('@rnet.cf/rnet-core');

module.exports = function messageCreate(dispatcher, message) {
	if (!dispatcher.rnet.isReady || (message.author && message.author.bot)) return Promise.reject();
	if (!message.channel.guild) return Promise.reject();

	if (dispatcher.config.handleRegion && !utils.regionEnabled(message.channel.guild, dispatcher.config)) return Promise.reject();

	const guildConfig = dispatcher.rnet.guilds.get(message.channel.guild.id);
	if (guildConfig) {
		return Promise.resolve({
			message: message,
			guild: message.channel.guild,
			guildConfig: guildConfig,
			isAdmin: dispatcher.rnet.permissions.isAdmin(message.author),
		});
	}

	return dispatcher.rnet.guilds.getOrFetch(message.channel.guild.id).then(guildConfig => { // eslint-disable-line
		const guild = message.channel.guild;
		if (!guild.cacheMessages && (guildConfig.actionlog || guildConfig.modules.Automod !== false)) {
			if (guildConfig.modules.Automod !== false || guildConfig.actionlog.messageDelete || guildConfig.actionlog.messageEdit) {
				guild.cacheMessages = true;
			}
		}

		return {
			message: message,
			guild: message.channel.guild,
			guildConfig: guildConfig,
			isAdmin: dispatcher.rnet.permissions.isAdmin(message.author),
		};
	});
};

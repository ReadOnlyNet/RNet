'use strict';

const { utils } = require('@rnet.cf/rnet-core');

class PermissionsManager {
	constructor(rnet) {
		this._config = rnet.config;
		this.rnet = rnet;
	}

	/**
	 * Check if user is bot admin
	 * @param  {User|Member} user User object
	 * @returns {Boolean}
	 */
	isAdmin(user) {
		if (!user || !user.id) return false;
		if (this.rnet.globalConfig.developers && this.rnet.globalConfig.developers.includes(user.id)) {
			return true;
		}
		return (user.id === this._config.client.admin);
	}

	isOverseer(user) {
		if (!user || !user.id) return false;
		return (this.rnet.globalConfig.overseers && this.rnet.globalConfig.overseers.includes(user.id));
	}

	/**
	 * Check if user is server admin
	 * @param  {Member} member Member object
	 * @param  {GuildChannel} channel Channel object
	 * @returns {Boolean}
	 */
	isServerAdmin(member, channel) {
		// ignore DM
		if (!member || !channel.guild) return false;
		// let permissions = member.permissionsFor(channel);
		return (member.id === channel.guild.ownerID || (member.permission &&
				(member.permission.has('administrator') || member.permission.has('manageGuild'))));
	}

	/**
	 * Check if user is server mod
	 * @param  {Member} member Guild member object
	 * @param  {GuildChannel} channel Channel object
	 * @returns {Boolean}
	 */
	isServerMod(member, channel) {
		// ignore DM
		if (!member || !channel.guild) return false;

		const guildConfig = this.rnet.guilds.get(channel.guild.id);

		if (this.isAdmin(member) || this.isServerAdmin(member, channel)) return true;

		// server config may not have loaded yet
		if (!guildConfig) return false;

		// check mod roles
		if (guildConfig.modRoles && member.roles && member.roles.find(r => guildConfig.modRoles.includes(r))) {
			return true;
		}

		// sanity check
		if (!guildConfig.mods) return false;

		return guildConfig.mods.includes(member.id);
	}

	canOverride(channel, member, command) {
		if (!member || !channel) return null;

		const guildConfig = this.rnet.guilds.get(channel.guild.id);

		if (!guildConfig.permissions || !guildConfig.permissions.length) return null;

		const channelPerms = guildConfig.channelPermissions;
		const rolePerms = guildConfig.rolePermissions;

		let canOverride = null;

		if (channelPerms && channelPerms[channel.id] && channelPerms[channel.id].commands.hasOwnProperty(command)) {
			canOverride = channelPerms[channel.id].commands[command];
		}

		if (!rolePerms) return canOverride;

		const roles = utils.sortRoles(channel.guild.roles);

		for (let role of roles) {
			if (!rolePerms[role.id]) continue;
			if (member.roles.indexOf(role.id) === -1) continue;

			if (rolePerms[role.id].commands.hasOwnProperty(command)) {
				canOverride = rolePerms[role.id].commands[command];
				break;
			}
		}

		return canOverride;
	}
}

module.exports = PermissionsManager;

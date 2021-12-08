'use strict';

const eris = require('@rnet.cf/eris');
const { Module } = require('@rnet.cf/rnet-core');
const { Permissions } = eris.Constants;

class Premium extends Module {
	constructor(...args) {
		super(...args);

		this.module = 'Premium';
		this.description = 'Premium helper module.';
		this.core = true;
		this.list = false;
		this.enabled = true;
		this.hasPartial = false;
	}

	static get name() {
		return 'Premium';
	}

	async guildRoleCreate({ guild, role, guildConfig }) {
		// if (this.config.isPremium || this.config.beta) return;
		if (this.config.isPremium || this.config.beta || this.config.test) return;
		if (role.name !== 'RNet Premium' || role.managed !== true) return;
		if (!guildConfig.isPremium) return;

		await new Promise(res => setTimeout(res, 2000));

		const premiumMember = guild.members.get('168274283414421504');
		if (!premiumMember) return;

		const clientMember = guild.members.get(this.rnet.user.id);
		if (!clientMember) return;

		const rnetRole = guild.roles.find(r => r.name === 'RNet' && r.managed === true);
		if (!rnetRole || !rnetRole.position) return;

		let textPerms = ['readMessages', 'sendMessages', 'embedLinks', 'externalEmojis'],
			voicePerms = ['voiceConnect', 'voiceSpeak', 'voiceUseVAD'];

		let pos = rnetRole.position - 1;

		this.client.editRolePosition(guild.id, role.id, pos).catch(err => this.logger.error(err.message));

		for (let channel of guild.channels.values()) {
			let rnetPerms = channel.permissionsOf(clientMember.id),
				premiumPerms = channel.permissionsOf(premiumMember.id);

			if (channel.type === 0) {
				if ((rnetPerms.has('readMessages') && !premiumPerms.has('readMessages')) ||
					(rnetPerms.has('sendMessages') && !premiumPerms.has('sendMessages'))) {
						let permInt = textPerms.reduce((a, b) => {
							a |= Permissions[b];
							return a;
						}, 0);
						channel.editPermission(role.id, permInt, 0, 'role').catch(() => false);
				}
			} else if (channel.type === 2) {
				if ((rnetPerms.has('voiceConnect') && !premiumPerms.has('voiceConnect')) ||
					(rnetPerms.has('voiceSpeak') && !premiumPerms.has('voiceSpeak'))) {
					let permInt = voicePerms.reduce((a, b) => {
						a |= Permissions[b];
						return a;
					}, 0);
					channel.editPermission(role.id, permInt, 0, 'role').catch(() => false);
				}
			}
		}

		this.rnet.guilds.update(guild.id, { $set: { premiumInstalled: true } });
	}
}

module.exports = Premium;

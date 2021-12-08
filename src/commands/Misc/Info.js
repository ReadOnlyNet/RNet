'use strict';

const Command = Loader.require('./core/structures/Command');
const utils = Loader.require('./core/utils');
const redis = require('../../core/redis');

class Info extends Command {
	constructor(...args) {
		super(...args);

	this.aliases      = ['info'];
	this.group        = 'Misc';
	this.description  = 'Get bot info.';
	this.usage        = 'info';
	this.cooldown     = 60000;
	this.expectedArgs = 0;
	this.noDisable    = true;
	this.sendDM       = true;
	}

	async execute({ message }) {
		const embed = {
			color: utils.hexToInt('#3395d6'),
			author: {
				name: 'RNet',
				url: 'https://www.rnet.cf',
				icon_url: `${this.config.site.host}/${this.config.avatar}?r=${this.config.version}`,
			},
			fields: [],
		};

		embed.fields.push({ name: 'Version', value: this.config.pkg.version, inline: true });
		embed.fields.push({ name: 'Library', value: this.config.lib, inline: true });
		embed.fields.push({ name: 'Creator', value: this.config.author, inline: true });

		try {
			const res = await redis.hgetallAsync(`rnet:stats:${this.config.state}`);

			let shards = [];
			for (const key in res) {
				const shard = JSON.parse(res[key]);
				shards.push(shard);
			}

			const guildCount = utils.sumKeys('guilds', shards);
			const userCount = utils.sumKeys('users', shards);

			embed.fields.push({ name: 'Servers', value: guildCount.toString(), inline: true });
			embed.fields.push({ name: 'Users', value: userCount.toString(), inline: true });
		} catch (err) {
			this.logger.error(err);
		}

		embed.fields.push({ name: 'Website', value: '[rnet.cf](https://www.rnet.cf)', inline: true });
		embed.fields.push({ name: 'Invite', value: '[rnet.cf/invite](https://www.rnet.cf/invite)', inline: true });
		embed.fields.push({ name: 'Discord', value: '[rnet.cf/discord](https://www.rnet.cf/discord)', inline: true });
		embed.fields.push({ name: 'Donate', value: '[rnet.cf/donate](https://www.rnet.cf/donate)', inline: true });

		const len = Math.max(...this.config.contributors.map(r => r.name.length));

		const contributors = this.config.contributors.map(c => `\`${utils.pad(c.name, len)}\` - ${c.desc}`);
		const mentions = this.config.mentions.map(c => `\`${c.name}\` - ${c.desc}`);

		embed.fields.push({ name: 'Contributors', value: contributors.join('\n'), inline: false });
		embed.fields.push({ name: 'Honorable Mentions', value: mentions.join('\n'), inline: false });

		return this.sendMessage(message.channel, { embed });
	}
}

module.exports = Info;

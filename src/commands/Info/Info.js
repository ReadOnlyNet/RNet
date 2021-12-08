'use strict';

const {Command} = require('@rnet.cf/rnet-core');
const moment = require('moment');

require('moment-duration-format');

class Info extends Command {
	constructor(...args) {
		super(...args);

	this.aliases      = ['info'];
	this.group        = 'Info';
	this.description  = 'Get bot info.';
	this.usage        = 'info';
	this.cooldown     = 60000;
	this.expectedArgs = 0;
	this.noDisable    = true;
	this.sendDM       = true;
	}

	async execute({ message }) {
		const uptime = moment.duration(process.uptime(), 'seconds');
		const cluster = this.rnet.clientOptions.clusterId.toString();
		const uptimeText = uptime.format('w [weeks] d [days], h [hrs], m [min], s [sec]');
		const footer = `${this.config.stateName} | Cluster ${cluster} | Shard ${message.channel.guild.shard.id} | Uptime ${uptimeText}`;

		const embed = {
			color: this.utils.hexToInt('#3395d6'),
			author: {
				name: 'RNet',
				url: 'https://www.rnet.cf',
				icon_url: `${this.config.avatar}?r=${this.config.version}`,
			},
			fields: [],
			footer: {
				text: footer,
			},
		};

		embed.fields.push({ name: 'Version', value: this.config.version, inline: true });
		embed.fields.push({ name: 'Library', value: this.config.lib, inline: true });
		embed.fields.push({ name: 'Creator', value: this.rnet.globalConfig.author, inline: true });

		try {
			const [res, guildCounts] = await Promise.all([
				this.redis.hgetall(`rnet:stats:${this.config.state}`),
				this.redis.hgetall(`rnet:guilds:${this.config.client.id}`),
			]);

			let guildCount = Object.values(guildCounts).reduce((a, b) => a += parseInt(b), 0);

			let shards = [];
			for (const key in res) {
				const shard = JSON.parse(res[key]);
				shards.push(shard);
			}

			const userCount = this.utils.sumKeys('users', shards);

			embed.fields.push({ name: 'Servers', value: guildCount.toString(), inline: true });
			embed.fields.push({ name: 'Users', value: userCount.toString(), inline: true });
		} catch (err) {
			this.logger.error(err);
		}

		embed.fields.push({ name: 'Website', value: '[rnet.cf](https://www.rnet.cf)', inline: true });
		embed.fields.push({ name: 'Invite', value: '[rnet.cf/invite](https://www.rnet.cf/invite)', inline: true });
		embed.fields.push({ name: 'Discord', value: '[rnet.cf/discord](https://www.rnet.cf/discord)', inline: true });
		embed.fields.push({ name: 'Donate', value: '[rnet.cf/donate](https://www.rnet.cf/donate)', inline: true });

		return this.sendMessage(message.channel, { embed });
	}
}

module.exports = Info;

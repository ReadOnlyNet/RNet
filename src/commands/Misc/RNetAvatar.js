'use strict';

const {Command} = require('@rnet.cf/rnet-core');

class RNetAvatar extends Command {
	constructor(...args) {
		super(...args);

		this.aliases = ['rnetavatar', 'rnetav'];
		this.group = 'Misc';
		this.description = 'Generates a RNet-like avatar.';
		this.usage = 'rnetav';
		this.cooldown = 10000;
		this.expectedArgs = 0;
	}

	execute({ message, args }) {
		let user = args.length ? this.resolveUser(message.channel.guild, args[0]) : message.author;

        if (!user) {
            return this.error(message.channel, `Couldn't find that user.`);
        }

        user = user.user || user;

		let avatar = user.dynamicAvatarURL(null, 256);
		const rnetAvatar = `${this.config.colorapi.host}/rnetav?url=${avatar}?r=1.1`;
        // avatar = avatar.match(/.gif/) ? `${avatar}&f=.gif` : avatar;

        return this.sendMessage(message.channel, { embed: {
            author: {
                name: this.utils.fullName(user),
                icon_url: user.dynamicAvatarURL(null, 32).replace(/\?size=.*/, ''),
            },
            title: 'Avatar',
            image: { url: rnetAvatar, width: 256, height: 256 },
        } });
	}
}

module.exports = RNetAvatar;

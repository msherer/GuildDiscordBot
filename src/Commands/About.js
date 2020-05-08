const Command = require('../Command');

class About extends Command
{
	commandName = 'About';

	commandAliases = ['about'];

	processMessage(message, tokens)
	{
		try {
			return message.channel.send(this.aboutEmbed());
		} catch (error) {
			message.channel.send(error);
		}
	}

	aboutEmbed()
	{
		var aboutEmbed = {
			color: 0x0099ff,
			title: 'Guild Discord Bot | About',
			url: 'https://discord.js.org',
			author: {
				name: 'R E M E I',
				icon_url: 'https://cdn.discordapp.com/avatars/84456781761228800/6f98cdf438b400196ee4dbc6401d8eef.webp',
				url: 'https://discord.js.org',
			},
			description: 'Guild Discord Bot is a bot focused on utility and information to help players access ' +
				'information that they would normally have to seek in-game or through a third party resource. This bot ' +
				'is solely owned and maintained by Remei. Suggestions for new features and constructive criticism are ' +
				'always welcome!',
			thumbnail: {
				url: 'https://i.imgur.com/ln8fPTL.png',
			},
			timestamp: new Date(),
			footer: {
				text: 'Support R E M E I with some Arcanite!',
				icon_url: 'https://cdn.discordapp.com/avatars/84456781761228800/6f98cdf438b400196ee4dbc6401d8eef.webp',
			},
		};

		return { embed: aboutEmbed };
	}
}

module.exports = About;
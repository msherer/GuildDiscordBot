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
			description: 'Guild Discord Bot! A bot to help us stay organized and sane.',
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
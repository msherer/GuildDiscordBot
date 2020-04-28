const Command = require('../Command');

class Commands extends Command
{
	commandName = 'Commands';

	commandAliases = ['commands'];
	
	processMessage(message, tokens)
	{
		var embeds = this.getCommands();
		embeds.forEach(embed => {
			message.channel.send(embed);
		});
	}

	function getCommands()
	{
		var embeds = [];

		Object.keys(config.commands).forEach(function (key) {
			var label = key.toUpperCase();
			var nodes = [];

			config.commands[key].forEach(node => {
				nodes.push(node);
			});

			embeds.push(this.generateEmbed(label, key, nodes));
		});

		return embeds;
	}

	function generateEmbed(label, key, nodes)
	{
		const embed = new Discord.MessageEmbed()
			.setColor('#0x0099ff')
			.setTitle(label + ' | GDB')
			.setURL('https://discord.js.org')
			.setAuthor(
				'R E M E I',
				'https://cdn.discordapp.com/avatars/84456781761228800/6f98cdf438b400196ee4dbc6401d8eef.webp',
				'https://discord.js.org',
			)
			.setDescription('List of bot commands')
			.setThumbnail('https://i.imgur.com/ln8fPTL.png')
			.setFooter(
				'Support R E M E I with some Arcanite!',
				'https://cdn.discordapp.com/avatars/84456781761228800/6f98cdf438b400196ee4dbc6401d8eef.webp',
			);

			nodes.forEach(node => {
				embed.addField(node.name, node.value);
			});

			return embed;
	}
}

module.exports = Commands;
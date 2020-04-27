const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const botName = 'GuildDiscordBot';

console.log(getCommands());

client.once('ready', () => {
	console.log('Guild Discord Bot Bot Loaded!');
});

client.on('message', message => {
	if (!isGbdCommand(message.content)) { return }
	const withoutPrefix = message.content.slice(config.prefix.length);
	const split = withoutPrefix.split(/ +/);
	const command = split[0];
	const args = split.slice(1);
	const user = message.author;
	const msg = message.content;
	const channel = message.channel;
	const msgToLower = msg.toLowerCase();

	if (user.username === botName) { return }

	switch (args[0].toLowerCase()) {
		// TEST COMMANDS
		case 'test':
			channel.send(`Test response: ${user.username}`);
			break;
		case 'balls':
			channel.send('Lol... You said balls.');
			break;

		// HELP COMMANDS
		case 'about':
			channel.send(aboutEmbed());
			break;
		case 'commands':
			var embeds = getCommands();
			embeds.forEach(embed => {
				channel.send(embed);
			});
			break;

		// CRAFTING COMMANDS
		case 'enchant':
			channel.send('Command not implemented yet.');
			break;
		case 'armor':
			channel.send('Command not implemented yet.');
			break;
		case 'potion':
			channel.send('Command not implemented yet.');
			break;

		// CLASS COMMANDS
		case 'rogue':
			channel.send('Command not implemented yet.');
			break;
		case 'warrior':
			channel.send('Command not implemented yet.');
			break;
		case 'priest':
			channel.send('Command not implemented yet.');
			break;
		case 'mage':
			channel.send('Command not implemented yet.');
			break;
		case 'druid':
			channel.send('Command not implemented yet.');
			break;
		case 'shaman':
			channel.send('Command not implemented yet.');
			break;
		case 'paladin':
			channel.send('Command not implemented yet.');
			break;
		case 'warlock':
			channel.send('Command not implemented yet.');
			break;
		case 'hunter':
			channel.send('Command not implemented yet.');
			break;

		// EPGP COMMANDS
		case 'epgp':
			channel.send('Command not implemented yet.');
			break;

		// DEFAULT COMMAND
		default:
			channel.send(`Sorry ${user.username} I couldn't find your command. Try \`!gdb commands\` to view all of my available commands.`);
	}
});

function getCommands()
{
	var embeds = [];

	Object.keys(config.commands).forEach(function (key) {
		var label = key.toUpperCase();
		var nodes = [];

		config.commands[key].forEach(node => {
			nodes.push(node);
		});

		embeds.push(generateEmbed(label, key, nodes));
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

function isGbdCommand(message)
{
	return (message.startsWith(config.prefix) ? true : false);
}

function aboutEmbed()
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

client.login(config.token);

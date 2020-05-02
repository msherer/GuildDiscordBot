const Discord = require('discord.js');
const auth = require('./config/auth.json');
const config = require('./config/config.json');
const client = new Discord.Client();
const commandContainer = new (require('./src/CommandContainer'));

const dependencyMap = {
	'Discord': Discord,
	'discordClient': client,
	'config': config,
	'prefix': config.prefix,
	'commandList': config.commandsList
};

for (const key in config.commandsList) {
	const command = new (require(`./src/Commands/${config.commandsList[key]}`));
	command.initialize(dependencyMap);
	commandContainer.add(config.commandsList[key], command);
}

client.on('ready', () => {
    console.log('Guild Discord Bot Bot Loaded!');
});

client.login(auth.token);

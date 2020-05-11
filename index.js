const Discord = require('discord.js');
const auth = require('./config/auth.json');
const generalConfig = require('./config/config.json');
const craftConfig = require('./config/craft.json');
const rosterConfig = require('./config/roster.json');
const client = new Discord.Client();
const commandContainer = new (require('./src/CommandContainer'));

const dependencyMap = {
    'Discord': Discord,
    'discordClient': client,
    'config': generalConfig,
    'craft': craftConfig,
    'roster': rosterConfig,
    'prefix': generalConfig.prefix,
    'commandList': generalConfig.commandsList
};

for (const key in generalConfig.commandsList) {
    const command = new (require(`./src/Commands/${generalConfig.commandsList[key]}`));
    command.initialize(dependencyMap);
    commandContainer.add(generalConfig.commandsList[key], command);
}

client.on('ready', () => {
    console.log('Guild Discord Bot Bot Loaded!');
});

client.login(auth.token);

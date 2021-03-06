const Discord = require('discord.js');
const auth = require('./config/auth.json');
const generalConfig = require('./config/config.json');
const craftConfig = require('./config/craft.json');
const rosterConfig = require('./config/roster.json');
const client = new Discord.Client();
const logger = new (require('./src/Utilities/Logger/Log'));
const botPrefix = '!gdb';


const dependencyMap = {
    'Discord': Discord,
    'discordClient': client,
    'config': generalConfig,
    'craft': craftConfig,
    'roster': rosterConfig,
    'prefix': generalConfig.prefix,
    'commandList': generalConfig.commandsList,
    'log': logger
};



for (const key in generalConfig.commandsList) {
    const command = new (require(`./src/Commands/${generalConfig.commandsList[key]}`));
    command.initialize(dependencyMap);
}

client.on('ready', () => {
    logger.initialize(client);

    console.log(`Logged in as ${client.user.tag}`);
	client.user.setActivity(
            `${botPrefix} commands | Running on ${client.guilds.cache.size} servers`
	);
    console.log('Guild Discord Bot Bot Loaded!');
});

client
    .on("error", console.error)
    .on("warn", console.warn)
    .on("debug", console.log);

client
    .on("reconnecting", () => {
        console.warn("GuildDiscordBot is reconnecting...");
    })
    .on("disconnect", () => {
        console.warn("Warning! GuildDiscordBot has disconnected!");
    });

client.login(auth.token);

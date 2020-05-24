class Logger {
    initialize(client) {
        client.guilds.cache.array().forEach(g => {
            let guild = client.guilds.cache.get(g.id);
            var hasChannel = false;

            if (guild.channels.cache.find(c => c.name.toLowerCase() === 'gdb-logs')) {
                hasChannel = true;
            }

            if (hasChannel === false) {
                this.createLogChannel(client, guild);
            }
        });
    }

    createLogChannel(client, guild) {
        try {
            guild.channels.create("gdb-logs", "text")
                .then(
                    channel => {
                        let ch = guild.channels.cache.get(channel.id);
                        ch.guild.roles.cache.array().forEach(role => {
                            if (role.name === "Moderators"
                                || role.name === "Boodead"
                                || role.name === "Privleged"
                                || role.name === "GuildDiscordBot"
                                || role.name === "Officer"
                                || role.name === "Guild Bot"
                            ) {
                                ch.updateOverwrite(role, { VIEW_CHANNEL: true });
                            } else {
                                ch.updateOverwrite(role, {
                                    VIEW_CHANNEL: false,
                                    CREATE_INSTANT_INVITE: false,
                                    SEND_MESSAGES: false,
                                    SEND_TTS_MESSAGES: false,
                                    MANAGE_MESSAGES: false,
                                    EMBED_LINKS: false,
                                    ATTACH_FILES: false,
                                    READ_MESSAGE_HISTORY: false,
                                    MENTION_EVERYONE: false,
                                    USE_EXTERNAL_EMOJIS: false,
                                    ADD_REACTIONS: false,
                                    MANAGE_WEBHOOKS: false
                                });
                            }
                        });

                        client.channels.cache.get(channel.id).send('Log channel created.');
                    }
                )
                .error(console.error);
        } catch(e) {
            console.log(e);
        }
    }

    log(messenger, cmd, message, err = '') {
        let channel = messenger.guild.channels.cache.find(c => c.name.toLowerCase() === 'gdb-logs');
        let lastChannel = messenger.guild.channels.cache.get(messenger.member.lastMessageChannelID);
        var chMessage = `----------------\nChannel: ${lastChannel}\nUser: ${messenger.member.displayName}\nCommand: ${cmd}\n${message.split('%20').join(' ')}`;

        if (err !== '') {
            chMessage += `\n${err}`;
        }

        try {
            channel.send(chMessage);
        } catch(e) {
            console.log(e);
        }
    }
}

module.exports = Logger;

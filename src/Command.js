class Command
{
	dependencies = [];
    commandAliases = [];
    commandName = null;

	initialize(dependencyMap)
	{
		this.dependencies = dependencyMap;

        for (let dependency in this.dependencies) {
            if (!this.dependencies.hasOwnProperty(dependency)) {
                throw "Failed to locate dependency: " + dependency;
            }

            this[this.dependencies[dependency]] = this.dependencies[dependency];
        }

        this.dependencies.discordClient.on('message', message => {
            let messageText = message.content;
            if (messageText.substr(0, 4) !== this.dependencies.prefix) return;
            let tokens = message.content.split(' ');
            let command = tokens[1].toLowerCase();

            try {

                if (command === this.commandName || this.commandAliases.includes(command)) {
                    this.processMessage(message, tokens);
                }
            } catch(error) {
                message.channel.send(error);
            }
        });
	}

    processMessage(message, tokens)
    {

    }
}

module.exports = Command;
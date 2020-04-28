class Command
{
	dependencies = [];

	initialize(dependencyMap)
	{
		this.dependencies = dependencyMap;

        // this.dependencies.discord.message.send('here');

        for (let dependency in this.dependencies) {
            if (!this.dependencies.hasOwnProperty(dependency)) {
                throw "Failed to locate dependency: " + dependency;
            }

            this[this.dependencies[dependency]] = this.dependencies[dependency];
        }

        this.dependencies.discordClient.on('message', message => {
            messageText = message.content;
            if (messageText.substr(0, 1) !== this.commandPrefix) return;
            tokens = message.content.split(' ');
            command = tokens[0].substr(1).toLowerCase();
            this.processMessage(message, tokens);
        });
	}
}

module.exports = Command;
class Command
{
	dependencies = [];

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
            if (messageText.substr(0, 1) !== this.commandPrefix) return;
            let tokens = message.content.split(' ');
            let command = tokens[0].substr(1).toLowerCase();
            this.processMessage(message, tokens);
        });
	}
}

module.exports = Command;
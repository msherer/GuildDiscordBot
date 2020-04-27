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
            console.log('here');
        });
	}
}

module.exports = Command;
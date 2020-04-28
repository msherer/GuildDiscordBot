const Command = require('../Command');

class Test extends Command
{
	commandName = 'Test';

	commandAliases = ['test'];

	processMessage(message, tokens)
	{
		return message.channel.send(`Test response: ${message.author.username}`);
	}
}

module.exports = Test;
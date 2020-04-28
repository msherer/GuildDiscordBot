const Command = require('../Command');

class Test extends Command
{
	processMessage(message, tokens)
	{
		return message.channel.send(`Test response: ${message.author.username}`);
	}
}

module.exports = Test;
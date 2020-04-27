const Command = require('../Command');

class Potion extends Command
{
	processMessage(message, tokens)
	{
		return message.channel.send(`Test response: ${user.username}`);
	}
}

module.exports = Potion;
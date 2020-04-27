const Command = require('../Command');

class Enchant extends Command
{
	processMessage(message, tokens)
	{
		return message.channel.send(`Test response: ${user.username}`);
	}
}

module.exports = Enchant;
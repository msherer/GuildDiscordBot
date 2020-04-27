const Command = require('../Command');

class Commands extends Command
{
	processMessage(message, tokens)
	{
		return message.channel.send(`Test response: ${user.username}`);
	}
}

module.exports = Commands;
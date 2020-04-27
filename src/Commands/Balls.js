const Command = require('../Command');

class Balls extends Command
{
	processMessage(message, tokens)
	{
		return message.channel.send(`Test response: ${user.username}`);
	}
}

module.exports = Balls;
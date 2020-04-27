const Command = require('../Command');

class About extends Command
{
	processMessage(message, tokens)
	{
		return message.channel.send(`Test response: ${user.username}`);
	}
}

module.exports = About;
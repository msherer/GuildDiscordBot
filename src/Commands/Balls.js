const Command = require('../Command');

class Balls extends Command
{
	commandName = 'Balls';

	commandAliases = ['balls'];
	
	processMessage(message, tokens)
	{
		return message.channel.send('Lol... You said balls.');
	}
}

module.exports = Balls;
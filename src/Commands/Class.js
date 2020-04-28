const Command = require('../Command');

class Class extends Command
{
	commandName = 'Class';

	commandAliases = ['class'];
	
	processMessage(message, tokens)
	{
		return message.channel.send('Command not implemented yet.');
	}
}

module.exports = Class;
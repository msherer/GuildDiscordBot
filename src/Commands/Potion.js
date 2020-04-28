const Command = require('../Command');

class Potion extends Command
{
	commandName = 'Potion';

	commandAliases = ['potion'];
	
	processMessage(message, tokens)
	{
		return message.channel.send('Command not implemented yet.');
	}
}

module.exports = Potion;
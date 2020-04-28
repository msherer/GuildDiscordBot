const Command = require('../Command');

class Enchant extends Command
{
	commandName = 'Enchant';

	commandAliases = ['enchant'];
	
	processMessage(message, tokens)
	{
		return message.channel.send('Command not implemented yet.');
	}
}

module.exports = Enchant;
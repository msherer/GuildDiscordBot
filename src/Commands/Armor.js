const Command = require('../Command');

class Armor extends Command
{
	commandName = 'Armor';

	commandAliases = ['Armor'];
	
	processMessage(message, tokens)
	{
		return message.channel.send('Command not implemented yet.');
	}
}

module.exports = Armor;
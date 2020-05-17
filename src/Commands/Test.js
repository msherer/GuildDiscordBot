const Command = require('../Command');

class Test extends Command
{
	commandName = 'Test';

	commandAliases = ['test'];

	processMessage(message, tokens)
	{
		var user = message.mentions.members.first() || message.author;
		let embed = new this.dependencies.Discord.MessageEmbed()
		    .setAuthor(user.username)
		    .setImage(user.avatarURL())
		    .setColor('#275BF0');
		message.channel.send(embed);
	}
}

module.exports = Test;

const Command = require('../Command');
const craftConfig = require('../../config/craft.js');

class Craft extends Command
{
    commandName = 'Craft';

    commandAliases = ['craft'];

    processMessage(message, tokens)
    {
        return message.channel.send('Command not implemented yet.');
    }
}

module.exports = Craft;
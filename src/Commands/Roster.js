const Command = require('../Command');

class Roster extends Command
{
	commandName = 'Roster';

	commandAliases = ['roster'];

	processMessage(message, tokens)
	{
		const header = {
			"name": "name",
			"rank": "rank",
			"class": "class",
			"spec": "spec"
		};
		const roster = this.dependencies.config.roster;
		roster.unshift(header);
		
		const colWidth = 20;
		var topRow = '';
		var dataRow = '';
		const separator = '+';
		const hChar = '-';
		const vChar = '|';
		const space = ' ';
		const columns = Object.keys(header).length;
		var rows = [];
		var rt = '';
		for (var isp = 0; isp < columns; isp++) {
			topRow += separator + hChar.repeat(colWidth);
			if (isp == (columns - 1)) {
			    topRow += separator;
			    rt += topRow + "\n";
			}
		}
		
		for (var isv = 0; isv < roster.length; isv++) {
		    for (var isk = 0; isk < Object.keys(roster[isv]).length; isk++) {
		        
		        if (isk === 0) dataRow += vChar;
		        
		        var rowKeys = Object.keys(roster[isv]);
		        var rKey = rowKeys[isk];
		        var spacers = (colWidth - roster[isv][rKey].length) / 2;
		        var lSpace = spacers;
		        var rSpace = Math.round(spacers);

		        dataRow += space.repeat(lSpace) + roster[isv][rKey] + space.repeat(rSpace);
		        
		        if (isk < columns - 1) dataRow += vChar;
		        
		        if (isk === columns - 1) { 
		            dataRow += vChar;
		            rows.push(dataRow);
		            rows.push(topRow);
			    rt += dataRow + "\n" + topRow + "\n";
		            dataRow = '';
		        }
		    }
		}

		try {
			if (rt instanceof String || typeof rt === 'string') {
				console.log(rt);
				message.channel.send("```\n" + rt + "\n```");
			}
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = Roster;

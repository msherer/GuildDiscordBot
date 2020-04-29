const Command = require('../Command');

class Roster extends Command
{
	commandName = 'Roster';

	commandAliases = ['roster'];

	processMessage(message, tokens)
	{
		var header = {
			"name": "name",
			"rank": "rank",
			"class": "class",
			"spec": "spec"
		};
		var roster = this.dependencies.config.roster;
		var colWidth = 20;
		var topRow = '';
		var dataRow = '';
		var separator = '+';
		var hChar = '-';
		var vChar = '|';
		var space = ' ';
		var columns = Object.keys(roster[0]).length;
		var rows = [];

		roster.unshift(header);

		for (isp = 0; isp < columns; isp++) {
			topRow += separator + hChar.repeat(colWidth);
			
			if (isp === columns - 1) {
		        topRow += separator;
		        rows.push(topRow);
			}
		}

		for (isv = 0; isv < roster.length; isv++) {
		    for (isk = 0; isk < Object.keys(roster[isv]).length; isk++) {
		        
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
		            dataRow = '';
		        }
		    }
		}

		for (isj = 0; isj < rows.length; isj++) {
		    console.log(rows[isj]);
		}
	}
}

module.exports = Roster;
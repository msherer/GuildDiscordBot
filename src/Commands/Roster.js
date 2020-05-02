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
		let dataRow = '';
		const separator = '+';
		const hChar = '-';
		const vChar = '|';
		const space = ' ';
		const columns = Object.keys(header).length;
		let data = [];

		// 1. Generate top row
		var topRow = this.generateTopRow(columns, colWidth, hChar, separator);

		// 2. Generate header row for page heading
		var headerRow = this.generateHeaderRow(columns, colWidth, vChar, space, separator, header);

		// 3. Gather a page of data (19 records)
		data = this.generateData(columns, colWidth, roster, vChar, space, 19, topRow);

		// 4. Render results to the user
		this.render(message, topRow, headerRow, data);
	}

	generateTopRow(columns, colWidth, hChar, separator)
	{
		let topRow = '';

		for (let isp = 0; isp < columns; isp++) {
			topRow += separator + hChar.repeat(colWidth);
			if (isp === (columns - 1)) {
				topRow += separator;
			}
		}
		
		return topRow;
	}

	generateHeaderRow(columns, colWidth, vChar, space, separator, header)
	{
		let headerRow = '';
		var rowKeys = Object.keys(header);

		for (let isq = 0; isq < columns; isq++) {
			var spacers = (colWidth - rowKeys[isq].length) / 2;
			var lSpace = spacers;
			var rSpace = Math.round(spacers);

			headerRow += vChar + space.repeat(lSpace) + rowKeys[isq] + space.repeat(rSpace);
			if (isq === (columns -1)) {
				headerRow = headerRow + vChar;
			}
		}

		return headerRow;
	}

	generateData(columns, colWidth, roster, vChar, space, pageSize, topRow)
	{
		let page = [];
		let dataRow = '';
		
		for (let isv = 0; isv < roster.length; isv++) {
			for (let isk = 0; isk < Object.keys(roster[isv]).length; isk++) {
				if (isk === 0) dataRow += vChar;

				var rowKeys = Object.keys(roster[isv]);
				var rKey = rowKeys[isk];
				var spacers = (colWidth - roster[isv][rKey].length) / 2;
				var lSpace = spacers;
				var rSpace = Math.round(spacers);

				dataRow += space.repeat(lSpace) + roster[isv][rKey] + space.repeat(rSpace);
				if (isk < columns - 1) dataRow += vChar;
				
				if (isk === columns -1) {
					dataRow += vChar;
					page.push(dataRow + "\n" + topRow + "\n");
					dataRow = '';
				}
			}
		}

		return page;
	}

	render(message, topRow, headerRow, data)
	{
		let length = data.length + 1;
		let payload = '';

		for (let iss = 1; iss < length; iss++) {
			if (typeof data[iss] !== 'undefined') {
				payload += data[iss];
			}

			if (iss % 10 === 0) {
				try {
					if (payload instanceof String || typeof payload === 'string') {
						payload = "```\n" 
							+ topRow + "\n"
							+ headerRow + "\n"
							+ topRow + "\n" 
							+ payload + "\n```";
						console.log(payload);
						message.channel.send(payload)
						payload = '';
					}
				} catch (error) {
					console.log(error);
				}
			}
		}
	}
}

module.exports = Roster;

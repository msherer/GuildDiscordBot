class CommandContainer
{
	commandList = [];

	add(key, command)
	{
		this.commandList[key] = command;
	}

	get(key)
	{
		return this.commandList[key];
	}

	all()
	{
		return this.commandList;
	}
}

module.exports = CommandContainer;

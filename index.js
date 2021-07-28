//Imports from discord.js
const { Client, Intents } = require('discord.js');

//Initiate the Client contructor
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    partials: ['USER', 'GUILD_MEMBER', 'MESSAGE']
});

//Import dependencies
const chalk = require('chalk');
require('dotenv').config();

//Import essential files
const mongo = require('./mongo');
const loadCommands = require('./commands/load-commands');
const loadSlashCommands = require('./slashCommands/load-slash-commands');

//Define functions
const wait = require('util').promisify(setTimeout);

client.on('ready', async () => {
    console.log('Client logged in!');

    console.log(chalk.bold.yellow('Loading commands...'));

    //Load commands
    await loadCommands(client);

    await wait(3000);
    console.log(chalk.bold.green('Successfully loaded all commands'));

    console.log(chalk.bold.yellow('Loading slash-commands...'));

    //Load slash-commands
    await loadSlashCommands(client);

    await wait(3000);
    
    console.log(chalk.bold.green('Successfully loaded all slash-commands'));

    //Load database connection
    await mongo();
});

client.login(process.env.TOKEN);
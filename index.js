//Imports from discord.js
const { Client, Intents } = require('discord.js');

//Initiate the Client contructor
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
    partials: ['USER', 'GUILD_MEMBER', 'MESSAGE']
});

//Import dependencies
const chalk = require('chalk');
require('dotenv').config();

//Import essential files
const mongo = require('./mongo');
const loadCommands = require('./commands/load-commands');
const loadSlashCommands = require('./slashCommands/load-slash-commands');
const loadEvents = require('./load-events');

//Define functions
const wait = require('util').promisify(setTimeout);

client.on('ready', async () => {
    console.log('Client logged in!');

    //Load events
    await loadEvents(client);
    console.log(chalk.magenta('Events loaded'));
    

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
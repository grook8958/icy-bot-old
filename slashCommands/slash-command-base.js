
const { Permissions } = require('discord.js');

const messages = require('../messages.json');

const errorEmbed = require('../functions/error-embed');
const getLanguage = require('../functions/get-language');

 
 const validatePermissions = (permissions) => {
   const validPermissions = [
     'CREATE_INSTANT_INVITE',
     'KICK_MEMBERS',
     'BAN_MEMBERS',
     'ADMINISTRATOR',
     'MANAGE_CHANNELS',
     'MANAGE_GUILD',
     'ADD_REACTIONS',
     'VIEW_AUDIT_LOG',
     'PRIORITY_SPEAKER',
     'STREAM',
     'VIEW_CHANNEL',
     'SEND_MESSAGES',
     'SEND_TTS_MESSAGES',
     'MANAGE_MESSAGES',
     'EMBED_LINKS',
     'ATTACH_FILES',
     'READ_MESSAGE_HISTORY',
     'MENTION_EVERYONE',
     'USE_EXTERNAL_EMOJIS',
     'VIEW_GUILD_INSIGHTS',
     'CONNECT',
     'SPEAK',
     'MUTE_MEMBERS',
     'DEAFEN_MEMBERS',
     'MOVE_MEMBERS',
     'USE_VAD',
     'CHANGE_NICKNAME',
     'MANAGE_NICKNAMES',
     'MANAGE_ROLES',
     'MANAGE_WEBHOOKS',
     'MANAGE_EMOJIS',
   ]
 
   for (const permission of permissions) {
     if (!validPermissions.includes(permission)) {
       throw new Error(`Unknown permission node "${permission}"`)
     }
   }
 }
 
 module.exports = async (client, commandOptions) => {
   let {
     commandData,
     testOnly = false,
     deleted = false,
     permissions = [],
     callback,
   } = commandOptions
 
   
 
   
 
   // Ensure the permissions are in an array and are all valid
   if (permissions.length) {
     if (typeof permissions === 'string') {
       permissions = [permissions]
     }
 
     validatePermissions(permissions)
   }
   //testGuild
   const testGuild = client.guilds.cache.get('809138856040726580');

   //Fetch all guild commands
   const guildCommands = await testGuild?.commands.fetch();

   //Fetch all global commands
   const globalCommands = await client.application?.commands.fetch();
   
   if (deleted) {
     if (testOnly) {
      const cmd = await guildCommands.find(cmd => cmd.name === commandData.name);

      await testGuild?.commands.delete(cmd);
      return
     } else {
      const cmd = await globalCommands.find(cmd => cmd.name === commandData.name);
      
      await client.application?.commands.delete(cmd)
      return
     };
   };

   console.log(`Registering command "${commandData.name}"`)

   if (testOnly) {
    //If test only
    const cmd = guildCommands.find(cmd => cmd.name === commandData.name);

    //Check if the command already exists
    if (cmd) {
      //Edit existing command
      testGuild?.commands.edit(cmd, commandData);
    } else {
      //Create new command
      testGuild?.commands.create(commandData);
    };
   } else {
    //If test only
    const cmd = globalCommands.find(cmd => cmd.name === commandData.name);

    //Check if the command already exists
    if (cmd) {
      //Edit existing command
      client.application?.commands.edit(cmd, commandData);
    } else {
      //Create new command
      client.application?.commands.create(commandData);
    };
   };
 
   // Listen for interactions
   client.on('interactionCreate', async (interaction) => {
     const { member, guild, commandName } = interaction
     const lang = await getLanguage(guild.id)
     
     if (commandData.name === commandName) {
       //A command has been ran

      for (const permission of permissions) {
        //Check if member has correct permissions
        if (!member.permissions.has(Permissions.FLAGS[permission])) {
          
          interaction.reply({
            embeds: [errorEmbed(messages.PERMISSION_ERROR[lang])],
            ephemeral: true
          });
          return
        };
      };

      //Execute command
      callback(interaction, client)
        .catch(function(err) {
          interaction.reply({
            embeds: [errorEmbed('An error occured and the command was unable to run')],
            ephemeral: true
          });
          console.log(err);
        });
      return

     }

     
   });
 };
 
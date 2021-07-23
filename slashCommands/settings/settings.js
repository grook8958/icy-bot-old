const errorEmbed = require('../../functions/error-embed');

module.exports = {
  commandData: {
    name: 'settings',
    description: 'Change the server settings',
    options: [{
      type: 'SUB_COMMAND',
      name: 'view',
      description: 'View current server settings'
    },
    {
      type: 'SUB_COMMAND',
      name: 'language',
      description: 'Change the language to be used by the bot',
      options: [{
        type: 'STRING',
        name: 'new-language',
        description: 'The new language for the server',
        required: true,
        choices: [
          {
            name: 'english',
            value: 'english'
          },
          {
            name: 'français',
            value: 'french'
          },
          {
            name: 'español',
            value: 'spanish'
          },
          {
            name: 'deutsch',
            value: 'german'
          }
        ]
      }]
    },
    {
      type: 'SUB_COMMAND',
      name: 'prefix',
      description: 'Change the server prefix',
      options: [{
        type: 'STRING',
        name: 'new-prefix',
        description: 'The new server prefix',
        required: true
      }]
    }]
  },
  testOnly: true,
  deleted: false,
  permissions: ["MANAGE_GUILD"],
  callback: async ( interaction ) => {
    //Get the sub-command
    const subCommand = interaction?.options._subCommand

    
    
    //Execute the correct function depending of the sub-command
    switch(subCommand) {
      case('view'):
        view(interaction);
        break;
      case('language'):
        language(interaction);
        break;
      case('prefix'):
        prefix(interaction);
        break;
    }
  } 
}

async function view(interaction) {
  const { guild } = interaction

    //Import functions
    const getLanguage = require('../../functions/get-language');
    const getPrefix = require('../../functions/get-prefix');

    const lang = await getLanguage(guild.id);
    const prefix = await getPrefix(guild.id);
    const messages = require('../../messages.json');
    const config = require('../../config.json');

    const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js');

    const prefixChangeButton = new MessageButton()
      .setCustomId('prefix-button')
      .setEmoji('❓')
      .setLabel('Change Prefix')
      .setStyle('PRIMARY');

    const languageChangeButton = new MessageButton()
      .setCustomId('language-button')
      .setEmoji('🌍')
      .setLabel('Change language')
      .setStyle('PRIMARY');
    const resetDefaults = new MessageButton()
      .setCustomId('reset-defaults-button')
      .setLabel('Reset Settings')
      .setStyle('DANGER');
    const row = new MessageActionRow()
      .addComponents([prefixChangeButton, languageChangeButton]);
    const row2 = new MessageActionRow()
      .addComponents(resetDefaults);
      
    const embed = new MessageEmbed()
      .setTitle(config.emojis.gear + '  ' + messages.SETTINGS_EMBED.TITLE[lang])
      .addField(messages.SETTINGS_EMBED.PREFIX.TITLE[lang], '❓  ' + `\`${prefix}\``, true)
      .addField(messages.SETTINGS_EMBED.LANGUAGE.TITLE[lang], '🌍 ' + `\`${messages.LANGUAGES[lang]}\``, true)
      .setColor(config.colors.default);

    if (interaction.replied) {
      interaction.editReply({
        embeds: [embed],
        components: [row, row2]
      });
    } else {
      interaction.reply({
        embeds: [embed],
        components: [row, row2]
      });
    };

    const filter = i => i.isButton() && i.user.id === interaction.user.id
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });


    collector.on('collect', async i => {
      
      switch(i.customId) {
        case('language-button'):
          setLanguage(i);
          break;
        case('prefix-button'):
          setPrefix(i);
          break;
        case('reset-defaults-button'):
          resetToDefault(i);
          break;
      };

    });


  async function setLanguage(interaction) {
    const wait = require('util').promisify(setTimeout);
    const languageSchema = require('../../schemas/language-schema');
    const successEmbed = require('../../functions/success-embed');
    const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
    const selectMenu = new MessageSelectMenu()
      .setCustomId('lang')
      .setPlaceholder('Language')
      .setMaxValues(1)
      .addOptions([
        {
          label: 'English',
          description: 'Select English as the new language',
          value: 'english'
        },
        {
          label: 'Français',
          description: 'Choisi le Français comme la nouvelle langue',
          value: 'french'
        },
        {
          label: 'Español',
          description: 'Eligió el español como nuevo idioma',
          value: 'spanish'
        },
        {
          label: 'Deutsch',
          description: 'Deutsch als neue Sprache gewählt',
          value: 'german'
        }
      ]);
    const button = new MessageButton()
      .setCustomId('cancel')
      .setLabel(messages.CANCEL[lang])
      .setStyle('DANGER');
    const row = new MessageActionRow()
      .addComponents([selectMenu]);
    const row2 = new MessageActionRow()
      .addComponents([button]);
    const embed = new MessageEmbed()
      .setDescription(messages.LANGUAGE_SELECT[lang])
      .setColor(config.colors.default);
    interaction.update({
      embeds: [embed],
      components: [row, row2]
    });
    const filter = (int => int.user.id === interaction.user.id);
    const collector = interaction.channel.createMessageComponentCollector({filter, time: 20000 });
    let newLang
    collector.on('collect', async int => {
      switch(int.customId) {
        case('cancel'):
          //Cancel
          collector.stop('cancel');
          int.update({
            embeds: [errorEmbed(messages.CANCELLED[lang])],
            components: []
          });
          await wait(3000);
          //Put back to the original menu
          view(interaction);
          break;
        case('lang'):
          //Change lang
          const selectMenu2 = new MessageSelectMenu()
            .setCustomId('select')
            .setDisabled(true)
            .setPlaceholder(messages.LANGUAGES[int.values[0]])
            .addOptions([
              {
                label: 'English',
                description: 'Select English as the new language',
                value: 'english'
              }
            ]);
          const rowRes = new MessageActionRow()
            .addComponents([selectMenu2]);
          int.update({
            embeds: [successEmbed(messages.LANGUAGE_SET[int.values[0]])],
            components: [rowRes]
          });
          newLang = int.values[0]
          collector.stop('success');
          break;
      };
      

    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'cancel') return;
      if (reason === 'success') {
        await languageSchema.findOneAndUpdate({
          _id: guild.id
        }, {
          _id: guild.id,
          language: newLang
        }, {
          upsert: true
        });
        await wait(3000);
        view(interaction);
      };
    });
  };

};

async function language(interaction) {
  const { value: string } = interaction.options.get('language').options.get('new-language')
  

    const { guild } = interaction

    //Import functions
    const getLanguage = require('../../functions/get-language');
    const errorEmbed = require('../../functions/error-embed');
    const successEmbed = require('../../functions/success-embed');

    //Language Stuff
    const oldLang = await getLanguage(guild.id) || 'english';
    const messages = require('../../messages.json');
    const languageSchema = require('../../schemas/language-schema');

    const newLang = string

    const supportedLangs = ['french', 'english', 'german', 'spanish'];

    //Check if it's a valid language
    if (!supportedLangs.includes(newLang)) {
      const error = messages.LANGUAGE_NOT_SUPPORTED[oldLang].replace('{LANG}', newLang);
      return await interaction.reply({
        embeds: [errorEmbed(error)],
        ephemeral: true
      });
    };
    
    await languageSchema.findOneAndUpdate({
      _id: guild.id
    }, {
      _id: guild.id,
      language: newLang
    }, {
      upsert: true
    });

    const lang = await getLanguage(guild.id);
    //Success message
    return await interaction.reply({
      embeds: [successEmbed(messages.LANGUAGE_SET[lang])]
    });
};

async function prefix(interaction) {
  const { guild } = interaction

  const getLanguage = require('../../functions/get-language');
  const errorEmbed = require('../../functions/error-embed');
  const successEmbed = require('../../functions/success-embed');

  //Language Stuff
  const lang = await getLanguage(guild.id);
  const messages = require('../../messages.json');

  const prefixSchema = require('../../schemas/prefix-schema');

  const { value: newPrefix } = interaction.options.get('prefix').options.get('new-prefix');

  const split = newPrefix.split('');

  

  if (split.length > 3) {
    return await interaction.reply({
      embeds: [errorEmbed(messages.PREFIX_TOO_LONG[lang])],
      ephemeral: true
    });
  };

  await prefixSchema.findOneAndUpdate({
    _id: guild.id
  }, {
    _id: guild.id,
    prefix: newPrefix
  }, {
    upsert: true
  });

  interaction.reply({
    embeds: [successEmbed(messages.PREFIX_SET[lang].replace('{PREFIX}', newPrefix))]
  });

};

async function setPrefix(interaction) {
  const { guild, channel } = interaction

  const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');

  const wait = require('util').promisify(setTimeout);

  const getLanguage = require('../../functions/get-language');
  const errorEmbed = require('../../functions/error-embed');
  const successEmbed = require('../../functions/success-embed');

  const prefixSchema = require('../../schemas/prefix-schema');

  const config = require('../../config.json');

  const messages = require('../../messages.json');
  const lang = await getLanguage(guild.id);

  const embed = new MessageEmbed()
    .setDescription(messages.PREFIX_MESSAGE[lang])
    .setColor(config.colors.default);
  const cancelBtn = new MessageButton()
    .setLabel(messages.CANCEL[lang])
    .setStyle('DANGER')
    .setCustomId('cancel');
  const prefixesSlctMenu = new MessageSelectMenu()
    .setCustomId('prefixes')
    .setPlaceholder('Prefixes')
    .addOptions([
      {
        label: '!',
        value: '!'
      },
      {
        label: '?',
        value: '?'
      },
      {
        label: '+',
        value: '+'
      },
      {
        label: '=',
        value: '='
      },
      {
        label: '>',
        value: '>'
      },
      {
        label: '<',
        value: '<'
      },
      {
        label: ':',
        value: ':'
      }  
    ]);
  const row = new MessageActionRow()
    .addComponents([prefixesSlctMenu]);
  const row2 = new MessageActionRow()
    .addComponents([cancelBtn]);
  interaction.update({
    embeds: [embed],
    components: [row, row2]
  });
  

  const filter = i => i.user.id === interaction.user.id;
  const btnCollector = channel.createMessageComponentCollector({ filter, time: 15000 });


  
  let newPrefix;
  

  btnCollector.on('collect', i => {
    if (i.customId === 'cancel') {
      //Do cancel stuff
      btnCollector.stop('cancel');

      const cancelBtn = new MessageButton()
        .setLabel(messages.CANCELLED[lang])
        .setStyle('DANGER')
        .setDisabled(true)
        .setCustomId('cancel');
      const prefixesSlctMenu = new MessageSelectMenu()
        .setCustomId('prefixes')
        .setPlaceholder('- -')
        .setDisabled(true)
        .addOptions([
          {
            label: '!',
            value: '!'
          }
        ]);
        
        const rowRes = new MessageActionRow()
          .addComponents(prefixesSlctMenu); 
        const rowRes2 = new MessageActionRow()
          .addComponents(cancelBtn);
        i.update({
          components: [rowRes, rowRes2],
          embeds: [errorEmbed(messages.CANCELLED[lang])]
        });
    } else if (i.customId === 'prefixes') {
      

      const cancelBtn = new MessageButton()
        .setLabel(messages.CANCELLED[lang])
        .setStyle('DANGER')
        .setDisabled(true)
        .setCustomId('cancel');
      const prefixesSlctMenu = new MessageSelectMenu()
        .setCustomId('prefixes')
        .setPlaceholder(i.values[0])
        .setDisabled(true)
        .addOptions([
          {
            label: '!',
            value: '!'
          }
        ]);
        
        const rowRes = new MessageActionRow()
          .addComponents(prefixesSlctMenu); 
        const rowRes2 = new MessageActionRow()
          .addComponents(cancelBtn);
        i.update({
          components: [rowRes, rowRes2],
          embeds: [successEmbed(messages.PREFIX_SET[lang].replace('{PREFIX}', i.values[0]))]
        });
        newPrefix = i.values[0];
        btnCollector.stop('success');
    };
  });

  btnCollector.on('end', async (collected, reason) => {
    if (reason === 'cancel') {
      await wait(3000);
      view(interaction);
    } else if (reason === 'success') {
      await prefixSchema.findOneAndUpdate({
        _id: guild.id
      }, {
        _id: guild.id,
        prefix: newPrefix
      }, {
        upsert: true
      });
      await wait(3000);
      view(interaction);
    };
  }); 
}

async function resetToDefault(interaction) {
  //Interaction Properties
  const { guild, channel } = interaction;

  //Other
  const wait = require('util').promisify(setTimeout);
  const config = require('../../config.json');

  //Lib Imports
  const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

  //Language Imports
  const getLanguage = require('../../functions/get-language');
  const lang = await getLanguage(guild.id)
  const messages = require('../../messages.json');

  //Functions
  const successEmbed = require('../../functions/success-embed');
  const errorEmbed = require('../../functions/error-embed');

  //Schemas
  const languageSchema = require('../../schemas/language-schema');
  const prefixSchema = require('../../schemas/prefix-schema');

  const alertEmbed = new MessageEmbed()
    .setTitle(messages.RESET_SETTINGS_EMBED.TITLE[lang])
    .setDescription(messages.RESET_SETTINGS_EMBED.DESCRIPTION[lang])
    .setColor(config.colors.error);
  const resetSettingsButton = new MessageButton()
    .setCustomId('reset-settings-button')
    .setLabel(messages.RESET_SETTINGS_BTN[lang])
    .setStyle('SUCCESS');
  const cancelButton = new MessageButton()
    .setCustomId('cancel-button')
    .setStyle('DANGER')
    .setLabel(messages.CANCEL[lang]);
  const row = new MessageActionRow()
    .addComponents([resetSettingsButton, cancelButton]);
  interaction.update({
    embeds: [alertEmbed],
    components: [row]
  });

  const filter = i => i.isButton() && i.user.id === interaction.user.id
  const collector = await createMessageComponentCollector({filter, time: 15000});

  collector.on('collect', i => {

    const resetSettingsButton = new MessageButton()
      .setCustomId('reset-settings-button')
      .setLabel(messages.RESET_SETTINGS_BTN[lang])
      .setStyle('SUCCESS')
      .setDisabled(true);
    const cancelButton = new MessageButton()
      .setCustomId('cancel-button')
      .setStyle('DANGER')
      .setLabel(messages.CANCEL[lang])
      .setDisabled(true);
    const resRow = new MessageActionRow()
      .addComponents([resetSettingsButton, cancelButton]);

    switch(i.customId) {
      case('reset-settings-button'):
        //Do stuff
        break;
      case('cancel-button'):
        
        i.update({
          embeds: [errorEmbed(messages.CANCELLED[lang])],
          components: [resRow]
        })
        wait(3000)
        view(interaction)
        break;
    };
  });

};
module.exports = {
  commandData: {
    name: 'ban',
    description: 'Ban an user from a server',
    options: [{
      type: 'SUB_COMMAND',
      name: 'id',
      description: 'Ban a user using there id',
      options: [{
        type: 'STRING',
        name: 'user-id',
        description: 'The id of the user to ban',
        required: true
      },
      {
        type: 'STRING',
        name: 'reason',
        description: 'The reason of the ban'
      }]
    },
    {
      type: 'SUB_COMMAND',
      name: 'member',
      description: 'Ban using a member mention',
      options: [{
        type: 'USER',
        name: 'member',
        description: 'The member to ban',
        required: true
      },
      {
       type: 'STRING',
       name: 'reason',
       description: 'The reason of the ban' 
      }]
    }], 
  },
  permissions: ["BAN_MEMBERS"],
  testOnly: true,
  callback: async ( interaction ) => {
    const subCommand = interaction.options.getSubCommand() 

    switch(subCommand) {
      case('member'):
        ban(interaction);
        break;
      case('id'):
        banId(interaction);
        break;
    };
  }
}
async function ban(interaction) {
  const { guild } = interaction

  const getLanguage = require('../../functions/get-language');
  const lang = await getLanguage(guild.id);
  const messages = require('../../messages.json');

  const member = interaction.options.getMember('member');
  const reason = interaction.options.getString('reason') || messages.NO_REASON_PROVIDED[lang];

  const successEmbed = require('../../functions/success-embed');
  const errorEmbed = require('../../functions/error-embed');

  const banDMmsg = messages.BAN_DM[lang].replace('{GUILD}', guild.name).replace('{REASON}', reason);
  

  //Check if the member can ban
  if (interaction.member.roles.highest.rawPosition <= member.roles.highest.rawPosition) {
    interaction.reply({
      embeds: [errorEmbed(messages.CANNOT_BAN[lang])]
    });
    return
  }
  let cannotDM = true
  if (!member.bot) {
    try {
      cannotDM = false
      const DMchannel = await member.createDM();
      DMchannel.send({
        embeds: [errorEmbed(banDMmsg)]
      });
    } catch(e) {
      cannotDM = true
    }
  }

  try {
    member.ban({
      reason: reason
    });
  } catch(e) {
    interaction.reply({
      embeds: [errorEmbed(messages.BAN_FAIL[lang])],
      ephemeral: true
    });
    console.error(e);
    return
  }

  interaction.reply({
    embeds: [successEmbed(banMsg)]
  });
  if (cannotDM) {
    interaction.followUp({
      embeds: [errorEmbed(messages.CANNOT_DM[lang])]
    });
  }
}

async function banId(interaction) {
  const { guild } = interaction

  const getLanguage = require('../../functions/get-language');
  const lang = await getLanguage(guild.id);
  const messages = require('../../messages.json');

  const id = interaction.options.getString('user-id');
  const reason = interaction.options.getString('reason') || messages.NO_REASON_PROVIDED[lang];

  const successEmbed = require('../../functions/success-embed');
  const errorEmbed = require('../../functions/error-embed');

  

  
  const member = await guild.bans.create(id, {reason: reason})
    .catch(function(e) {
      interaction.reply({
        embeds: [errorEmbed(messages.BAN_FAIL[lang])]
      });
      return
    })

  const banMsg = messages.BAN_SUCCESS[lang].replace('{MEMBER}', member?.user?.tag ?? member?.id ?? member?.tag ?? member?.id ?? member).replace('{REASON}', reason);
  interaction.reply({
    embeds: [successEmbed(banMsg)]
  });
}
module.exports = {
  commandData: {
    name: 'warn',
    description: 'Save a warning for an user',
    options: [{
      type: 'USER',
      name: 'member',
      description: 'The member to warn',
      required: true
    },
    {
      type: 'STRING',
      name: 'reason',
      description: 'The reason of the warn',
      required: true
    }]
  },
  permissions: ['MUTE_MEMBERS', 'MANAGE_NICKNAMES'],
  testOnly: true,
  callback: async ( interaction ) => {
    //Destructure properties from Interaction
    const { options, guild, channel } = interaction;

    //Get Interaction options
    const member = options.getMember('member');
    const reason = options.getString('reason'); 
    const moderator = interaction.user;

    //Language imports
    const getLanguage = require('../../functions/get-language');
    const lang = await getLanguage(guild.id);
    const messages = require('../../messages.json');

    //Other functions
    const errorEmbed = require('../../functions/error-embed');
    const successEmbed = require('../../functions/success-embed');
    const { randomUUID } = require('crypto')

    //Import warnings schema
    const warningsSchema = require('../../schemas/warnings-schema');

    /**
     * warning object
     * {
     *   id: (random-generated)
     *   timestamp:
     *   reason:
     *   moderator:
     * }
     */

    const warning = {
      id: randomUUID(),
      timestamp: Date.now(),
      reason: reason,
      moderator: moderator.tag,
      moderatorId: moderator.id 
    }

    await warningsSchema.findOneAndUpdate({
      _id: member.user.id,
      guildId: guild.id
    }, {
      _id: member.user.id,
      guildId: guild.id,
      $push: {
        warnings: warning
      }
    }, {
      upsert: true
    });

    interaction.reply({
      embeds: [successEmbed(messages.WARNING_SET[lang].replace('{MEMBER}', member.user.tag).replace('{REASON}', reason))]
    });

  }
  
};
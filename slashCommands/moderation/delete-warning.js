const { watch } = require('../../schemas/warnings-schema');

module.exports = {
  commandData: {
    name: 'delete-warning',
    description: 'Remove a warning',
    options: [{
      type: 'USER',
      name: 'member',
      description: 'The member to remove a warning',
      required: true
    },
    {
      type: 'STRING',
      name: 'id',
      description: 'The id of the warning',
      required: true
    },
    {
      type: 'STRING',
      name: 'reason',
      description: 'The reason for removing a warning'
    }]
  },
  testOnly: true,
  permissions: ['MUTE_MEMBERS', 'MANAGE_NICKNAMES'],
  callback: async function(interaction) {
    //Destructure properties from Interaction
    const { options, guild, channel } = interaction;

    //Language imports
    const getLanguage = require('../../functions/get-language');
    const lang = await getLanguage(guild.id);
    const messages = require('../../messages.json');

    //Get Interaction options
    const member = options.getMember('member');
    const reason = options.getString('reason') || messages.NO_REASON_PROVIDED[lang]
    const id = options.getString('id'); 

    //Other functions
    const errorEmbed = require('../../functions/error-embed');
    const successEmbed = require('../../functions/success-embed');

    //Import warnings schema
    const warningsSchema = require('../../schemas/warnings-schema');

    const data = await warningsSchema.findOne({
      _id: member.id,
      guildId: guild.id
    });
    
    for (const warning of data.warnings) {
      if (warning.id === id) {
        await warningsSchema.findOneAndUpdate({
          _id: member.id,
          guildId: guild.id
        }, {
          _id: member.id,
          guildId: guild.id,
          $pull: {
            warnings: warning
          }
        }, {
          upsert: true
        });
        //Success
        interaction.reply({
          embeds: [successEmbed(messages.WARN_REMOVE[lang].replace('{MEMBER}', member.user.tag).replace('{ID}', id).replace('{REASON}', reason))]
        });
        return;
      }
    }
    //error id invalid
    interaction.reply({
      embeds: [errorEmbed(messages.INVALID_ID[lang].replace('{ID}', id))]
    });
  }
};
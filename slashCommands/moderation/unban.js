module.exports = {
  commandData: {
    name: 'unban',
    description: 'Unban a user',
    options: [{
      type: 'STRING',
      name: 'user-id',
      description: 'The id of the user to unban'
    },
    {
      type: 'STRING',
      name: 'reason',
      description: 'The reason of the unban'
    }]
  },
  permissions: ['BAN_MEMBERS'],
  testOnly: true,
  callback: async (interaction) => {
    
    const { guild } = interaction
    
    

    const errorEmbed = require('../../functions/error-embed');
    const successEmbed = require('../../functions/success-embed');
    const messages = require('../../messages.json');
    const getLang = require('../../functions/get-language');
    const lang = await getLang(guild.id);

    const userId = interaction.options.getString('user-id');
    const reason = interaction.options.getString('reason') || messages.NO_REASON_PROVIDED[lang];

    
    await guild.bans.remove(userId, reason)
      .catch(function(e) {
        interaction.reply({
          embeds: [errorEmbed(messages.UNBAN_FAIL[lang])]
        });
        console.error(e)
        return
      })

    interaction.reply({
      embeds: [successEmbed(messages.UNBAN_SUCCESS[lang].replace('{USER}', userId).replace('{REASON}', reason))]
    });

  }
}
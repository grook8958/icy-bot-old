const { MessageEmbed } = require('discord.js');
const { config } = require('dotenv');

module.exports = {
  commandData: {
    name: 'warnings',
    description: 'Show all the warnings of an user',
    options: [{
      type: 'USER',
      name: 'member',
      description: 'The member to show the warnings of',
      required: true 
    }]
  },
  testOnly: true,
  deleted: false,
  callback: async ( interaction ) => {
    //Destructure properties from Interaction
    const { options, guild, channel } = interaction;

    //Get Interaction options
    const member = options.getMember('member');
    const reason = options.getString('reason'); 
    const moderator = interaction.user.tag;

    //Language imports
    const getLanguage = require('../../functions/get-language');
    const lang = await getLanguage(guild.id);
    const messages = require('../../messages.json');

    //Other functions
    const errorEmbed = require('../../functions/error-embed');
    const successEmbed = require('../../functions/success-embed');

    //Import warnings schema
    const warningsSchema = require('../../schemas/warnings-schema');

    //Other imports
    const config = require('../../config.json');

    /**
     * warning object
     * {
     *   id: (random-generated)
     *   timestamp:
     *   reason:
     *   moderator:
     * }
     */
    const data = await warningsSchema.findOne({
      _id: member.user.id,
      guildId: guild.id
    });

    if (!data) {
      return interaction.reply({
        embeds: [errorEmbed(messages.NO_WARNS[lang].replace('{MEMBER}', member.toString()))]
      });
    };

    const warningEmbeds = [];
    
    const embed = new MessageEmbed()
      .setDescription(messages.WARNINGS_EMBED.DESCRIPTION[lang].replace('{MEMBER}', member.toString()))
      .setColor(config.colors.error);
    const embed2 = new MessageEmbed()
      .setDescription(messages.WARNINGS_EMBED.DESCRIPTION[lang].replace('{MEMBER}', member.toString()))
      .setColor(config.colors.error);
    let warnNumber = 0;
    for (const warning of data.warnings) {
      warnNumber++;
      if (warnNumber >= 25) {
        const { id, reason, moderator, timestamp, moderatorId } = warning;

        let correctTimestamp = timestamp / 1000;
        correctTimestamp = Math.floor(Math.trunc(correctTimestamp));

        embed2.addField(`${messages.WARNING[lang]} #${warnNumber}`, `ID: \`${id}\`\n${messages.REASON[lang]}: **${reason}**\n${messages.DATE[lang]}: <t:${correctTimestamp}>\n${messages.MODERATOR[lang]}: <@${moderatorId}> || ${moderator}`, false);
      } else {
        const { id, reason, moderator, timestamp, moderatorId } = warning;

        let correctTimestamp = timestamp / 1000;
        correctTimestamp = Math.floor(Math.trunc(correctTimestamp));
  
        embed.addField(`${messages.WARNING[lang]} #${warnNumber}`, `ID: \`${id}\`\n${messages.REASON[lang]}: **${reason}**\n${messages.DATE[lang]}: <t:${correctTimestamp}>\n${messages.MODERATOR[lang]}: <@${moderatorId}> || ${moderator}`, false);
      }
     
    };
    if (warnNumber >= 25) warningEmbeds.push(embed2)
    warningEmbeds.push(embed)
    /**
     * embed formatting
     * 
     * Field Title: Warning No.
     * Field Description: 
     * Id: `an id`
     * Reason: **some reason**
     * Date: some data
     * Moderator: @moderator
     */
    interaction.reply({
      embeds: warningEmbeds
    });
  }
};
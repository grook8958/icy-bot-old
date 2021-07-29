module.exports = {
  commandData: {
    name: 'mute',
    description: 'Prevent a use from chatting',
    options: [{
      type: 'USER',
      name: 'member',
      description: 'The member to mute',
      required: true
    },
    {
      type: 'STRING',
      name: 'duration',
      description: 'The duration of the mute',
      required: true
    },
    {
      type: 'STRING',
      name: 'reason',
      description: 'The reason of the mute'
    }]
  },
  permisisons: ['MUTE_MEMBERS'],
  testOnly: true,
  callback: async function(interaction, client) {
    //Destructure properties from Interaction
    const { options, guild } = interaction;

    //Language imports
    const getLanguage = require('../../functions/get-language');
    const lang = await getLanguage(guild.id);
    const messages = require('../../messages.json');

    //Get Interaction options
    const member = options.getMember('member');
    const reason = options.getString('reason') || messages.NO_REASON_PROVIDED[lang];
    const durationString = options.getString('duration');

    //Other functions
    const errorEmbed = require('../../functions/error-embed');
    const successEmbed = require('../../functions/success-embed');
    const redis = require('../../redis');

    const split = durationString.split('');

    const durationNumber = split[0];
    const durationType = split[1];

    const redisKeyPrefix = 'muted-';
    const mutedRoleID = '819225091900440597';

    redis.expire(async (message) => {
      if (message.startsWith(redisKeyPrefix)) {
          const split = message.split('-')
          
          const memberId = split[1]
          const guildId = split[2]

          const guild = client.guilds.cache.get(guildId);
          const member = guild.members.cache.get(memberId);
          const mutedRole = member.guild.roles.cache.get(mutedRoleID);

          member.roles.remove(mutedRole);
      }
    });

    if (isNaN(durationNumber)) {
      return await interaction.reply({
        embeds: [errorEmbed(messages.INVALID_DURATION[lang].replace('{DURATION}', durationString))],
        ephemeral: true
      });
    };

    

    const durations = {
      m: 60,
      h: 60 * 60,
      d: 60 * 60 * 24
    }

    if (!durations[durationType]) {
      return await interaction.reply({
        embeds: [errorEmbed(messages.INVALID_DURATION[lang].replace('{DURATION}', durationString))],
        ephemeral: true
      });
    };

    const seconds = durationNumber * durations[durationType];
    

    await giveRole(member);

    interaction.reply({
      embeds: [successEmbed(messages.MUTE_SUCCESS[lang].replace('{MEMBER}', member.user.tag).replace('{DURATION}', durationString).replace('{REASON}', reason))]
    });

    const redisClient = await redis();

    try {
      const redisKey = `${redisKeyPrefix}${member.user.id}-${guild.id}`
            
      if (seconds > 0) {
        redisClient.set(redisKey, 'true', 'EX', seconds);
      } else {
        redisClient.set(redisKey, 'true');
      }
    } finally {
      redisClient.quit();
    }

    
  }
}

async function giveRole(member) {
  const getMutedRole = require('../../functions/get-muted-role');
  const roleId = await getMutedRole(member.guild.id);
  const mutedRole = member.guild.roles.cache.get(roleId); //Get muted role from db

  if (mutedRole) {
    member.roles.add(mutedRole, `Muted by a moderator`);
  };
}
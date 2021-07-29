module.exports = {
	name: 'guildMemberAdd',
	once: false,
	async execute(member) {

    const { id, guild } = member; 
        
    const redis = require('../redis');
    const redisClient = await redis();
    const redisKeyPrefix = 'muted-';

    try{
      redisClient.get(`${redisKeyPrefix}${id}-${guild.id}`, (err, result) => {
        if (err) {
          console.error('Redis GET Error:', err)
        } else if (result) {
          giveRole(member)
        }
      })
    } finally {
      redisClient.quit();

    }
	},
};

async function giveRole(member) {
  const getMutedRole = require('../functions/get-muted-role');
  const roleId = await getMutedRole(member.guild.id);
  const mutedRole = member.guild.roles.cache.get(roleId); //Get muted role from db

  if (mutedRole) {
    await member.roles.add(mutedRole, 'Muted');
  };
}
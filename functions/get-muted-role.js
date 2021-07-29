module.exports = async (guildId = '') => {
  const mutedRoleSchema = require('../schemas/muted-role-schema');

  const data = await mutedRoleSchema.findById(guildId);
 
  return data.roleId
};
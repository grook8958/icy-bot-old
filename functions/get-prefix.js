module.exports = async (guildId = '') => {
    const prefixSchema = require('../schemas/prefix-schema');

    const data = await prefixSchema.findById(guildId);
   
    return data.prefix
};
module.exports = async (guildId = '') => {
    const languageSchema = require('../schemas/language-schema');

    const data = await languageSchema.findById(guildId);
   
    return data.language
};
module.exports = (message = '') => {
    const {┬áMessageEmbed } = require('discord.js');
    const config = require('../config.json');

    const successEmbed = new MessageEmbed()
        .setDescription(config.emojis.success + ' ' + message)
        .setColor(config.colors.success);
    return successEmbed
};
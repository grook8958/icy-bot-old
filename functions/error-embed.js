module.exports = (message = '') => {
    const {┬áMessageEmbed } = require('discord.js');
    const config = require('../config.json');

    const errorEmbed = new MessageEmbed()
        .setDescription(config.emojis.error + ' ' + message)
        .setColor(config.colors.error);
    return errorEmbed
};
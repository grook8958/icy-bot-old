const { MessageEmbed } = require('discord.js');
const { config } = require('../config.json');
const { colors, emojis } = config;
/**
 * Represents a Custom built Discord MessageEmbed
 */
class CustomEmbed {

  constructor(message, type) {
    /**
     * The message of this CustomEmbed
     * @type {?String}
     */
    this.message = message ?? null;

    /**
     * The type of this CustomEmbed,
     * either success, error or default
     * @type {String}
     */
    this.type = type ?? 'default';
  }

  
  /**
   * The expected color of the embed in hex format
   * @type {import('discord.js').HexColorString}
   */
  get color() {
    return colors[type];
  }

  /**
   * Builds the embed
   * @returns {import('discord.js').MessageEmbed}
   */
  build() {
    const string = emojis[type] ? `${emojis[type]} ${this.message}` : `${this.message}`;
    const customEmbed = new MessageEmbed()
      .setDescription(string)
      .setColor(colors[this.type]);
    return this.customEmbed = customEmbed;
  }

  /**
   * Change the message
   * @param {String} newMessage The new message of the custom embed
   * @returns {import('discord.js').MessageEmbed}
   */
  changeMessage(newMessage) {
    this.message = newMessage;
    return this.build();
  }

  
  /**
   * Change the type to either success, error or default
   * @param {String} newType
   * @returns {import('discord.js').MessageEmbed}
   */
  changeType(newType) {
    this.type = newType;
    return this.build();
  }
}

module.exports = CustomEmbed;
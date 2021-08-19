# Icy-bot
A multi-purpose discord bot using the latest features of discord using the [NodeJS](https://nodejs.org/) engine.

**This project is still Work In Progress and is incomplete**

# Dependencies

- [discord.js](npmjs.com/discord.js) v13.1.0 `npm install discord.js`
- [chalk](npmjs.com/chalk) v4.1.2 `npm install chalk`
- [dotenv](npmjs.com/dotenv) v10.0.0 `npm install dotenv`
- [mongoose](npmjs.com/mongoose) v5.13.7 `npm install mongoose`
- [redis](npmjs.com/redis) v3.1.2 `npm install redis`


# Changelog
- 19/08/2021 22:00 CEST: Added a debug section to the project, to easily identify issues
- 11/08/2021 20:49 CEST: Removed all "normal" commands due to message becoming a priviledged intent.
- 29/07/2021 13:37 CEST: Added mute command, 3 translations fixed a couple of bugs in index.js, redis.js and load-events.js
- 28/07/2021 14:32 CEST: Added delete-warnings command and 2 new translastion, fixed bugs in warn.js and more bug fixes
- 26/07/2021 15:17 CEST: Added warnings command and 6 translations & fixed some bugs
- 25/07/2021 11:44 CEST: Added warn command and 1 new translation
- 24/07/2021: Added ban and unban slash-commands and added 8 new translations
- 23/07/2021: Updated settings.js various bug fixes and added 2 translations to messages.json

# Setup 
For easy setup, run `npm run setup`, this will install all required dependencies and create the required .env file in which you must fill in all the fields, then when you think everything is correctly setup run `npm run debug` to check everything is working properly. If everything is okay, run the bot with `npm run start`.


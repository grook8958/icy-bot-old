module.exports = function() {
    const mongoose = require('mongoose');
    const chalk = require('chalk')

    require('dotenv').config();

    const URI = process.env.MONGO_URI;

    mongoose.connect(URI, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    mongoose.connection.on('connected', function() {
        console.log(chalk.green(`Mongoose default connection established at ${URI}`));
    });

    mongoose.connection.on('error', function(err) {
       console.log(chalk.bold.red(`A mongoose error occured, Error:\n${err}`));
    });

    mongoose.connection.on('disconnected', function() {
        console.log(chalk.red(`Mongoose default connection has disconected`));
    });

    process.on('SIGINT', function() {
        console.log(chalk.magenta('Mongoose default connection has disconnected due to application termination'));
        process.exit(0)
    });
}
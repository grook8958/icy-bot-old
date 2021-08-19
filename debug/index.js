//Import dependencies
const fs = require('fs');
const path = require('path');
const packagejson = require('../package.json');


//Create wait function
const wait = require('util').promisify(setTimeout);

//Desctructure some methods from fs
const { readFile, writeFile, access } = fs;

//Define problems
const problems = {};

const chalk = require('chalk');

//Define logging color function
const error = chalk.red.bgBlack;
const yellow = chalk.bold.yellow;

//Add missingDotEnvField property to problems
problems.missingDotEnvField = [];
problems.dotEnvIsMissing = false;
problems.missingDependencies = [];

//Inform the user that the debug started
console.log(yellow('[DEBUGGER] Starting Debug...'));

//Check if all dependencies are present
const checkDependecies = () => {
  const  { dependencies } = packagejson
  const reqDependencies = ['discord.js', 'chalk', 'redis', 'mongoose', 'dotenv']

  for (const reqDependencie of reqDependencies) {
    if (!dependencies[reqDependencie]) {
      problems.missingDependencies.push(reqDependencie);
      console.log(`${yellow('[DEBUGGER] ')}${error('ERR!')} ${reqDependencie} dependencie missing`);
    }
  }
}

//Debug .env
const debugDotEnv = () => {
  //Read content of .env file
  const file = '.env';
  readFile(path.join('.', file), 'utf8', (err, data) => {

    if (err?.code === 'ENOENT') {
      console.log(`${yellow('[DEBUGGER] ')}${error('ERR!')} Cannot find .env file in directory ${path.resolve('.')}`);
      problems.dotEnvIsMissing = true;
      return
    } else if (err) {
      throw err
    }
    //Split each lines into an array
    const split = data.split('\n');

    //Loop through this array
    for (const field of split) {

      //Split the the field and the value into an array
      const values = field.split('=');

      //Check if the value exists
      if (!values[1]) {
        console.log(`${yellow('[DEBUGGER] ')}${error('ERR!')} ${values[0]} field is missing.`);
    
        problems.missingDotEnvField.push(`ERR! ${values[0]} is missing.`);
        //console.log(problems)

      
      }
    }
  });
}

const debug = async () => {
  //Get full path to the logs directory
  const logDir = path.resolve('./debug/logs')

  //Debug dotEnv file
  debugDotEnv();

  //Check for required dependencies
  checkDependecies();

  //Wait a little for the debugging to finish
  await wait('750');

  //Inform the user that the debug ended
  console.log(yellow('[DEBUGGER] END OF DEBUG'));
  
  //Get & format the data
  const currentDate = new Date();
  const cDay = currentDate.getDate();
  const cMonth = currentDate.getMonth() + 1;
  const cYear = currentDate.getFullYear();
  const cHours = currentDate.getUTCHours();
  const cMinutes = currentDate.getUTCMinutes();
  const cSeconds = currentDate.getUTCSeconds();
  const date = `${cDay}-${cMonth}-${cYear}T${cHours}:${cMinutes}:${cSeconds}`;

  //Full file path & name
  const logFilePath = `${logDir}/log_${date}.txt`
  
  //Content of log file
  let data = `DEBUG REPORT - ${date}`
  data += '\n---------------------------'
  data += '\ndot-env issues:'

  //Check if their are any .env regarded problems
  if (problems.missingDotEnvField.length > 0) {
    //Loop through all the problems
    for (const missingDotEnvField of problems.missingDotEnvField) {
      //Add to the log file each problems
      data += `\n- ${missingDotEnvField}`;
    }
  } else if (problems.dotEnvIsMissing === false) {
    //Add to the log file that there is no issues
    data += 'No issues';
  } else {
    data += `File is missing at ${path.resolve('.')}`;
  }

  data += `\nmissing-dependencies:`;

  if (problems.missingDependencies.length > 0) {
    //Loop through all missing dependencies
    for (const missingDependencie of problems.missingDependencies) {
      //Add to the log file each missing dependencie
      data += `\n- ${missingDependencie}`;
    }
  } else {
    data += 'No dependencies are missing';
  }

  //Add some info at the bottom of the file
  data += '\n---------------------------'
  data += '\nTo fix dependencies issues, run the following command: "npm run setup."'
  data += '\nFor dot-env issues run: "npm run setup", then in the newly created file complete all the fields.'
  data += '\nTo check if everything is fixed feel free to re-run the debug using "npm run debug".'
  data += '\n---------------------------'
  data += '\nEND OF DEBUG REPORT'

  //Tell the user where he can find the log
  console.log(`A complete log can be found ${logFilePath}`);

  //Write the log file
  writeFile(logFilePath, data, err => {
    if (err) throw err;
  })

}

//Run debug
debug();




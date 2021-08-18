//Import dependencies
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

//Create wait function
const wait = require('util').promisify(setTimeout);

//Desctructure some methods from fs
const { readFile, writeFile } = fs;

//Define problems
const problems = {};

//Define logging color function
const error = chalk.red.bgBlack;
const yellow = chalk.bold.yellow;

//Add missingDotEnvField property to problems
problems.missingDotEnvField = [];

//Debug .env
const debugDotEnv = () => {
  //Read content of .env file
  const file = '.env';
  readFile(path.join('.', file), 'utf8', (err, data) => {
    if (err) throw err;
    //Split each lines into an array
    const split = data.split('\n');

    //Loop through this array
    for (const field of split) {

      //Split the the field and the value into an array
      const values = field.split('=');

      //Check if the value exists
      if (!values[1]) {
        console.log(`${yellow('[DEBUGGER] ')}${error('ERR!')} ${values[0]} is missing.`);
    
        problems.missingDotEnvField.push(`ERR! ${values[0]} is missing.`);
        //console.log(problems)

      
      }
    }
  });
}
//Inform the user that the debug started
console.log(yellow('[DEBUGGER] Starting Debug...'));



const debug = async () => {
  //Get full path to the logs directory
  const logDir = path.resolve('./debug/logs')

  //Debug dotEnv file
  debugDotEnv();

  //Wait a little for the debugging to finish
  await wait('750');

  //Inform the user that the debug ended
  console.log(yellow('[DEBUGGER] END OF DEBUG'));
  
  //Get & format the data
  const currentDate = new Date();
  const cDay = currentDate.getDate();
  const cMonth = currentDate.getMonth() + 1;
  const cYear = currentDate.getFullYear();
  const date = `${cDay}-${cMonth}-${cYear}`

  //Full file path & name
  const logFilePath = `${logDir}/log_${date}.txt`
  
  //Content of log file
  let data = `**DEBUG LOG** - ${date}\n.env Issues:`

  //Check if their are any .env regarded problems
  if (!problems.missingDotEnvField.length === 0) {
    //Loop through all the problems
    for (const missingDotEnvField of problems.missingDotEnvField) {
      //Add to the log file each problems
      data += `\n- ${missingDotEnvField}`;
    }
  } else {
    //Add to the log file that there is no issues
    data += 'No issues';
  }

  //Tell the user where he can find the log
  console.log(`A complete log can be found ${logFilePath}`);

  //Write the log file
  writeFile(logFilePath, data, err => {
    if (err) throw err;
  })

}

//Run debug
debug();




const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const wait = require('util').promisify(setTimeout);

const { readFile, writeFile } = fs;

const problems = {};

const red = chalk.red;
const error = chalk.red.bgBlack;
const yellow = chalk.bold.yellow;

problems.missingDotEnvField = [];


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
console.log(yellow('[DEBUGGER] Starting Debug...'));



const debug = async () => {
  const logDir = path.resolve('./debug/logs')

  //Debug dotEnv file
  debugDotEnv();

  await wait('750');

  console.log(yellow('[DEBUGGER] END OF DEBUG'));
  
  const currentDate = new Date();
  const cDay = currentDate.getDate();
  const cMonth = currentDate.getMonth() + 1;
  const cYear = currentDate.getFullYear();

  const date = `${cDay}-${cMonth}-${cYear}`
  const logFilePath = `${logDir}/log_${date}.txt`
  
  let data = `**DEBUG LOG** - ${date}\n.env Issues:`

  if (!problems.missingDotEnvField.length === 0) {
    for (const missingDotEnvField of problems.missingDotEnvField) {
      data += `\n- ${missingDotEnvField}`;
    }
  } else {
    data += 'No issues';
  }

  console.log(`A complete log can be found ${logFilePath}`);


  writeFile(logFilePath, data, err => {
    if (err) throw err;
  })

}

debug();




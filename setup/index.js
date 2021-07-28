const dir = require('./dir.json');

const fs = require('fs');

const data = 'TOKEN=\nDEFAULT_PREFIX=!\nMONGO_URI=\nREDIS_URI='

fs.writeFile(`${dir.directory}/.env`, data, 'utf8', function(err) {
    console.log('Successfully created .env file');
    process.exit(0);
});
// importing modules
const fs = require('fs');
const request = require('request');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

//parsing input from console
const args = process.argv.slice(2);
const url = args[0];
const path = args[1];
const validator = /^[a-z][a-z0-9+.-]*:/;

const isAbsoluteUrl = validator.test(url);

if (!isAbsoluteUrl || typeof path === `undefined`) {
  console.log(` Invalid Input (eg: node fetcher.js https://url download_path)`);
  process.exit();
}

request(url, (e, r, body) => {
  if (e) {
    console.log(`error ${e.errno}: ${e.syscall} ${e.code} ${e.hostname} `);
    process.exit();
  }
  fs.writeFile(path, body, {flag:'wx'} , function(err) {
    if (err) {
      if (err.code === `EEXIST`) {
        console.log(`A file already exists at the path: ${err.path}`);
        readline.question("Overwrite the existing file? (yes/no): ", answer => {
          if (answer === 'no') {
            console.log('Cool! Going to leave the file as it is');
            process.exit();
          } else {
            fs.writeFile(path, body, function() {
              console.log(`Downloaded and saved the ${body.length} bytes to ${path}`);
              process.exit();
            });
          }
        });
      } else {
        console.log(err);
      }
    } else {
      console.log(`Downloaded and saved the ${body.length} bytes to ${path}`);
      process.exit();
    }
  });
});

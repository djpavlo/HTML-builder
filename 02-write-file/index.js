const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });

let filePath = path.join(__dirname, '/text.txt');

var stream = new fs.WriteStream(filePath, { encoding: 'utf-8' });

console.log('You can write to file by sending text in console. Exit by command "exit" or ctrl+c');

rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
    return;
  }
  stream.write(input + '\n');
});

rl.on('close', () => {
  console.log('Goodbye!');
});
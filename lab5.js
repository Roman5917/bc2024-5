// lab5.js
const express = require('express');
const fs = require('fs');
const { Command } = require('commander');

// Створення екземпляра програми Commander
const program = new Command();

// Налаштування параметрів командного рядка
program
  .version('1.0.0')
  .requiredOption('-h, --host <host>', 'server host address')
  .requiredOption('-p, --port <port>', 'server port number')
  .requiredOption('-c, --cache <directory>', 'directory for cached files')
  .parse(process.argv);


const { host, port, cache } = program.opts();


if (!fs.existsSync(cache)) {
  console.log(`Cache directory "${cache}" not found. Creating it...`);
  fs.mkdirSync(cache, { recursive: true });  
} else {
  console.log(`Cache directory "${cache}" exists.`);
}
const app = express();


app.get('/', (req, res) => {
  res.send('Server is running!');
});


app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});

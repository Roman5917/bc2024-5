
const express = require('express');
const fs = require('fs');
const { Command } = require('commander');
const path = require('path');


const program = new Command();


program
  .version('1.0.0')
  .requiredOption('-h, --host <host>', 'адреса сервера')
  .requiredOption('-p, --port <port>', 'порт сервера')
  .requiredOption('-c, --cache <directory>', 'шлях до директорії')
  .parse(process.argv);


const { host, port, cache } = program.opts();

if (!fs.existsSync(cache)) {
  console.log(`Хеш папка "${cache}" не існує, створюю її`);
  fs.mkdirSync(cache, { recursive: true });  
} else {
  console.log(`Хеш папка "${cache}" уже існує`);
}


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let notes = {};


app.get('/notes/:name', (req, res) => {
  const noteName = req.params.name;

  if (!notes[noteName]) {
    return res.status(404).json({ message: 'Нотатку не знайдено' });
  }

  res.status(200).send(notes[noteName]);
});


app.put('/notes/:name', (req, res) => {
  const noteName = req.params.name;
  const newText = req.body.text;

  if (!notes[noteName]) {
    return res.status(404).json({ message: 'Нотатку не знайдено ' });
  }

  notes[noteName] = newText;
  res.status(200).send({ message: 'Нотатка оновлена' });
});

app.delete('/notes/:name', (req, res) => {
  const noteName = req.params.name;

  if (!notes[noteName]) {
    return res.status(404).json({ message: 'Нотатки не знайдено' });
  }

  delete notes[noteName];
  res.status(200).send({ message: 'Нотатка видалена' });
});


app.get('/notes', (req, res) => {
  const notesList = Object.keys(notes).map(name => ({
    name,
    text: notes[name]
  }));
  
  res.status(200).json(notesList);
});


app.post('/write', (req, res) => {
  const noteName = req.body.note_name;
  const noteText = req.body.note;

  if (notes[noteName]) {
    return res.status(400).json({ message: 'Не існує' });
  }

  notes[noteName] = noteText;
  res.status(201).json({ message: 'Нотатка створена' });
});


app.get('/UploadForm.html', (req, res) => {
  const formHtml = `
    <html>
      <body>
        <form action="/write" method="post" enctype="multipart/form-data">
          <label for="note_name">Note Name:</label><br>
          <input type="text" id="note_name" name="note_name"><br><br>
          <label for="note">Note Text:</label><br>
          <textarea id="note" name="note"></textarea><br><br>
          <input type="submit" value="Submit">
        </form>
      </body>
    </html>
  `;
  
  res.status(200).send(formHtml);
});


app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});

// INITIALIZATION
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// NPM Packages
const fs = require('fs');
const express = require('express');
const path = require('path');
const util = require("util");
// Setup variable objects
const app = express();
const PORT = process.env.port || 3001;
// Middleware
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
// Set static pathways
app.use(express.static('public'));

//UTILITIES (May be modularized later)
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//read
const readFromFile = util.promisify(fs.readFile);
//write
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
//read and write
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

const readAndDelete = (noteId, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      const specifiedNote = parsedData.find( ({id}) => id === noteId );
      const indexById = parsedData.indexOf(specifiedNote);
      parsedData.splice(indexById, 1);
      writeToFile(file, parsedData);
    }
  });
};

// Random id generator
function uuid() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

// PAGES PATHS SECTION
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// get "/" and server index.html
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/')));
// get "/notes" and serve notes.html
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')))


// API CALLS SECTION
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// get notes call
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
})

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to submit new notes`);
  const {
    title,
    text
  } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text
    };
    readAndAppend(newNote, './db/db.json');
    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

app.delete('api/notes/:id', (req, res) => {
  const noteId = req.params.id
  console.log(`Deleting ${noteId} from notes.`);
  readAndDelete(noteId, './db/db.json');
})

// LISTENING INDICATOR
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.listen(PORT, () =>
  console.log(`Serving static asset routes at http://localhost:${PORT}!`)
);

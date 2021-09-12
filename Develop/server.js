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
app.use(express.urlencoded({ extended: true }));
// Set static pathways
app.use(express.static('public'));

//UTILITIES (May be modularized later)
const readFromFile = util.promisify(fs.readFile);

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


// LISTENING INDICATOR
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

app.listen(PORT, () =>
  console.log(`Serving static asset routes at http://localhost:${PORT}!`)
);

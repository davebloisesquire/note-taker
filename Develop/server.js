// NPM Packages
const express = require('express');

// Setup variable objects
const app = express();
const PORT = process.env.port || 3001;
const path = require('path');

// Set static pathways
app.use(express.static('public'));

// get "/" and server index.html
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/')));

// get "/notes" and serve notes.html
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')))

app.listen(PORT, () =>
  console.log(`Serving static asset routes at http://localhost:${PORT}!`)
);

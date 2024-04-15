const router = require("express").Router();
const { Workspace, User } = require("../../models");
const nodemailer = require("nodemailer");

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
});

app.get('/api/notes', (req, res) => {
  // Read the db.json file and return the notes as JSON
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  // Read the existing notes from db.json
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);

    // Add the new note to the notes array
    const newNote = req.body;
    newNote.id = notes.length + 1; // Assign a unique ID
    notes.push(newNote);

    // Write the updated notes array back to db.json
    fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  // Read the existing notes from db.json
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);

    // Find the index of the note with the given id
    const index = notes.findIndex(note => note.id === parseInt(req.params.id));

    // If the note is found, remove it from the notes array
    if (index !== -1) {
      notes.splice(index, 1);

      // Write the updated notes array back to db.json
      fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes), (err) => {
        if (err) throw err;
        res.sendStatus(204); // Send a 204 (No Content) response
      });
    } else {
      res.status(404).send('Note not found');
    }
  });
});

module.exports = router;
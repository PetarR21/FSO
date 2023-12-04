const express = require('express');
const app = express();

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];

app.use(express.json());

app.get('/', (request, response) => {
  response.send('<h1>Express server</h1>');
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'missing content',
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

app.get('/api/notes/:id', (request, response) => {
  const id = +request.params.id;
  const note = notes.find((n) => n.id === id);

  if (note) response.json(note);
  else response.sendStatus(404);
});

app.delete('/api/notes/:id', (request, response) => {
  const id = +request.params.id;
  notes = notes.filter((n) => n.id !== id);

  response.sendStatus(204);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

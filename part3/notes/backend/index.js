const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const Note = require('./models/note');

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'uknown endpoint' });
};

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/', (request, response) => {
  response.send('<h1>Express server</h1>');
});

app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

app.post('/api/notes', async (request, response, next) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'missing content',
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  try {
    const savedNote = await note.save();
    response.json(savedNote);
  } catch (error) {
    next(error);
  }
});

app.get('/api/notes/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id);
    if (!note) {
      response.sendStatus(404);
    }
    response.json(note);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/notes/:id', async (request, response, next) => {
  try {
    const note = await Note.findByIdAndDelete(request.params.id);

    if (!note) {
      return response.sendStatus(404);
    }

    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.put('/api/notes/:id', async (request, response, next) => {
  try {
    const body = request.body;

    const updatedNote = await Note.findByIdAndUpdate(
      request.params.id,
      { important: body.important },
      { new: true }
    );

    if (!updatedNote) {
      return response.sendStatus(404);
    }

    response.json(updatedNote);
  } catch (error) {
    next(error);
  }
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const morgan = require('morgan');
const Person = require('./models/person');

const uknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'uknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' });
  }

  next(error);
};

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});

const customMorgan = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    tokens['body'](req, res),
  ].join(' ');
});

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(customMorgan);

app.get('/', async (request, response) => {
  const persons = await Person.find({});
  response.send(
    `<p>phonebook has info for ${persons.length} ${persons.length == 1 ? 'person' : 'people'}
    </p>
    <p>${new Date()}</p>
    `
  );
});

app.get('/api/persons', async (request, response) => {
  const persons = await Person.find({});
  response.json(persons);
});

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id);
    if (!person) {
      return response.sendStatus(404);
    }
    response.json(person);
  } catch (error) {
    next(error);
  }
});

app.post('/api/persons', async (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }
  if (await Person.findOne({ name })) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = new Person({
    name,
    number,
  });

  try {
    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await Person.findByIdAndDelete(request.params.id);

    if (!person) {
      return response.sendStatus(404);
    }

    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.put('/api/persons/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    const body = request.body;
    const personToUpdate = await Person.findById(id);

    if (!personToUpdate) {
      return response.sendStatus(404);
    }

    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      { number: body.number },
      { new: true }
    );

    response.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

app.use(uknownEndpoint);
app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

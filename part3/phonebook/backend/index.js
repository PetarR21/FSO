const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const morgan = require('morgan');

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const uknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'uknown endpoint' });
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

app.get('/', (request, response) => {
  response.send(
    `<p>phonebook has info for ${persons.length} ${persons.length == 1 ? 'person' : 'people'}
    </p>
    <p>${new Date()}</p>
    `
  );
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = +request.params.id;
  const person = persons.find((p) => p.id === id);
  response.json(person);
});

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }
  if (persons.find((p) => p.name === name)) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const newPerson = {
    name,
    number,
    id: Math.floor(Math.random() * 100000),
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = +request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.sendStatus(204);
});

app.put('/api/persons/:id', (request, response) => {
  const id = +request.params.id;
  const body = request.body;
  const personToUpdate = persons.find((p) => p.id === id);

  if (!personToUpdate) {
    return response.sendStatus(404);
  }

  const updatedPerson = { ...personToUpdate, number: body.number };
  persons = persons.map((p) => (p.id === id ? updatedPerson : p));
  response.json(updatedPerson);
});

app.use(uknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

const express = require('express');
const app = express();

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

app.use(express.json());

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

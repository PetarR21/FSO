const notesRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Note = require('../models/note');
const User = require('../models/user');

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
  response.json(notes);
});

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

notesRouter.post('', async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);

  if (!body.content) {
    return response.status(400).json({
      error: 'missing content',
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote);
  await user.save();
  response.status(201).json(savedNote);
});

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id);
  if (!note) {
    response.sendStatus(404);
  }
  response.json(note);
});

notesRouter.delete('/:id', async (request, response) => {
  const note = await Note.findByIdAndDelete(request.params.id);

  if (!note) {
    return response.sendStatus(404);
  }

  response.sendStatus(204);
});

notesRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id,
    { important: body.important },
    { new: true, runValidators: true, context: 'query' }
  );

  if (!updatedNote) {
    return response.sendStatus(404);
  }

  response.json(updatedNote);
});

module.exports = notesRouter;

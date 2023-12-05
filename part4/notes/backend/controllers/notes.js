const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

notesRouter.post('', async (request, response, next) => {
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

notesRouter.get('/:id', async (request, response, next) => {
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

notesRouter.delete('/:id', async (request, response, next) => {
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

notesRouter.put('/:id', async (request, response, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

module.exports = notesRouter;

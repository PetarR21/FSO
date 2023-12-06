const router = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const middleware = require('../utils/middleware');

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

router.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url } = request.body;

  const user = request.user;
  const blog = new Blog({
    title,
    author,
    url,
    likes: 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog);
  await user.save();
  response.status(201).json(savedBlog);
});

router.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.sendStatus(404);
  }
});

router.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id);
  if (!blogToDelete) {
    return response.sendStatus(404);
  }

  const user = request.user;

  if (blogToDelete.user.toString() !== user._id.toString()) {
    return response.status(401).send({ error: 'unauthorized operation' });
  }

  await Blog.findByIdAndDelete(request.params.id);
  response.sendStatus(204);
});

router.put('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
    context: 'query',
  });
  if (blog) {
    response.json(blog);
  } else {
    response.sendStatus(404);
  }
});
module.exports = router;

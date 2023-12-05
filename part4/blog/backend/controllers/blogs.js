const router = require('express').Router();
const Blog = require('../models/blog');

router.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

router.post('/', async (request, response) => {
  const { title, author, url } = request.body;
  const blog = new Blog({
    title,
    author,
    url,
    likes: 0,
  });

  const savedBlog = await blog.save();
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

router.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id);
  if (blog) {
    response.sendStatus(204);
  } else {
    response.sendStatus(404);
  }
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

const router = require('express').Router();
const Blog = require('../models/blog');

router.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

router.post('/', async (request, response, next) => {
  const { title, author, url } = request.body;
  const blog = new Blog({
    title,
    author,
    url,
    likes: 0,
  });

  try {
    const savedBlog = await blog.save();
    response.json(savedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

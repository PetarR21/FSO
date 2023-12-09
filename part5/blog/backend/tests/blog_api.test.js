const app = require('../app');
const supertest = require('supertest');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

describe('Blog API', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogs = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogs.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test('application returns the correct amount of blog posts in the JSON format', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('unique identifier property of the blog posts is named id', async () => {
    const blogs = await helper.blogsInDB();

    blogs.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });

  test('valid blog can be added', async () => {
    const blogObject = {
      title: 'test',
      author: 'test',
      url: 'test',
    };

    await api
      .post('/api/blogs')
      .send(blogObject)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).toContainEqual(blogObject.title);
  });

  test('if the likes property is missing from the request, it will default to the value 0', async () => {
    const blogObject = {
      title: 'test',
      author: 'test',
      url: 'test',
    };

    await api
      .post('/api/blogs')
      .send(blogObject)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const blogs = blogsAtEnd.map((b) => {
      return { title: b.title, likes: b.likes };
    });
    expect(blogs).toContainEqual({ title: blogObject.title, likes: 0 });
  });

  test('if the title or url properties are missing backend responds with status 400', async () => {
    const blogWithoutTitle = {
      author: 'test',
      url: 'test',
    };

    await api.post('/api/blogs').send(blogWithoutTitle).expect(400);

    const blogWithoutUrl = {
      title: 'test',
      author: 'test',
    };

    await api.post('/api/blogs').send(blogWithoutUrl).expect(400);
  });

  test('backend returns individual blog correctly', async () => {
    const blogs = await helper.blogsInDB();
    const blog = await blogs[0];

    const response = await api
      .get(`/api/blogs/${blog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.title).toEqual(blog.title);
  });

  test('blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDB();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test('blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToUpdate = blogsAtStart[0];

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: blogToUpdate.likes + 1 })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const blogs = blogsAtEnd.map((b) => {
      return { title: b.title, likes: b.likes };
    });
    expect(blogs).toContainEqual({ title: blogToUpdate.title, likes: blogToUpdate.likes + 1 });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

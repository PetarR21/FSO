const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 3,
  },
  {
    title: '3 Tips To Tackle Open-Ended Programming Tasks',
    author: 'Cara Borenstein',
    url: 'https://betterprogramming.pub/3-tips-to-tackle-open-ended-programming-tasks-db1d22fdadda',
    likes: 15,
  },
];

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const nonExistingID = async () => {
  const blog = new Blog({ title: 'willremove', author: 'willremove', url: 'willremove' });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

module.exports = {
  initialBlogs,
  blogsInDB,
  nonExistingID,
};

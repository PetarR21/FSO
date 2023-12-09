const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((a, b) => a + b.likes, 0);
};

const favouriteBlog = (blogs) => {
  return blogs.length === 0 ? null : _.maxBy(blogs, 'likes');
};

const mostBlogs = (blogs) => {
  return blogs.length === 0
    ? null
    : _.maxBy(
        _.map(_.groupBy(blogs, 'author'), (n) => {
          return {
            author: n[0].author,
            blogs: n.length,
          };
        }),
        'blogs'
      );
};

const mostLikes = (blogs) => {
  return blogs.length === 0
    ? null
    : _.maxBy(
        _.map(_.groupBy(blogs, 'author'), (key, value) => {
          return {
            author: value,
            likes: key.reduce((total, object) => total + object.likes, 0),
          };
        }),
        'likes'
      );
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};

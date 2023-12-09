const Blog = ({ blog }) => (
  <div>
    <p>
      {blog.title} {blog.author}
    </p>
    <p>likes: {blog.likes}</p>
  </div>
);

export default Blog;

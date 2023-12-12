import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState();
  const [author, setAuthor] = useState();
  const [url, setUrl] = useState();

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: title,
      author: author,
      url: url,
    };
    createBlog(blogObject);
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        title:
        <input
          type='text'
          name='title'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <br />
        author:
        <input
          type='text'
          name='author'
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
        <br />
        url:
        <input type='text' name='url' value={url} onChange={({ target }) => setUrl(target.value)} />
        <br />
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default BlogForm;

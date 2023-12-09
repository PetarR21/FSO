import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState();
  const [author, setAuthor] = useState();
  const [url, setUrl] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();

    loginService
      .login({ username, password })
      .then((user) => {
        window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
        blogService.setToken(user.token);
        setUser(user);
        setUsername('');
        setPassword('');
      })
      .catch((error) => {
        showNotification('wrong username or password', 'error');
      });
  };

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification notification={notification} />
      <form onSubmit={handleLogin}>
        <div>
          username{' '}
          <input
            type='text'
            name='Username'
            value={username}
            onChange={({ target }) => {
              setUsername(target.value);
            }}
          />
        </div>
        <div>
          password{' '}
          <input
            type='password'
            name='Password'
            value={password}
            onChange={({ target }) => {
              setPassword(target.value);
            }}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  );

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: title,
      author: author,
      url: url,
    };
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        showNotification(`a new blog ${title} by ${author} added`, 'success');
        setTitle('');
        setAuthor('');
        setUrl('');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const blogForm = () => (
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

  const blogList = () => (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div>
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <h2>blogs</h2>
          <Notification notification={notification} />
          <p>
            {user.name} logged in{' '}
            <button
              onClick={() => {
                setUser(null);
                window.localStorage.clear();
              }}
            >
              log out
            </button>
          </p>
          {blogForm()} {blogList()}
        </div>
      )}
    </div>
  );
};

export default App;

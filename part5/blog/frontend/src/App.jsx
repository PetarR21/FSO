import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
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

  const loginFormRef = useRef();

  const handleLogin = (credentials) => {
    loginService
      .login(credentials)
      .then((user) => {
        window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
        blogService.setToken(user.token);
        setUser(user);
        loginFormRef.current.setUsername('');
        loginFormRef.current.setPassword('');
      })
      .catch((error) => {
        showNotification('wrong username or password', 'error');
      });
  };

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification notification={notification} />
      <LoginForm onLogin={handleLogin} ref={loginFormRef} />
    </div>
  );

  const blogFormRef = useRef();

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        showNotification(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
          'success'
        );
        blogFormRef.current.toggleVisibility();
      })
      .catch((error) => {
        showNotification(error.message, 'error');
      });
  };

  const blogForm = () => (
    <Togglable buttonLabel='add blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  const likeBlog = (blog) => {
    blogService
      .update(blog.id, { likes: blog.likes + 1 })
      .then((updatedBlog) => {
        setBlogs(blogs.map((b) => (b.id === updatedBlog.id.toString() ? updatedBlog : b)));
        showNotification(`liked blog ${updatedBlog.title} by ${updatedBlog.author}`, 'success');
      })
      .catch((error) => {
        showNotification(error.message, 'error');
      });
  };

  const removeBlog = (blog) => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(blogs.filter((b) => b.id !== blog.id));
          showNotification(`Successfully removed blog ${blog.title} by ${blog.author}`, 'success');
        })
        .catch((error) => {
          showNotification(error.response.data.error, 'error');
        });
    }
  };

  const blogList = () => (
    <div>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} />
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

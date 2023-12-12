import { useState } from 'react';

const Blog = ({ blog, likeBlog,removeBlog }) => {
  const [view, setView] = useState(false);

  const toggleView = () => {
    setView(!view);
  };

  const showWhenView = { display: view ? '' : 'none' };

  return (
    <div className='blog'>
      {blog.title} {blog.author} <button onClick={toggleView}>{view ? 'hide' : 'view'}</button>
      <div style={showWhenView}>
        <div>{blog.url}</div>
        <div>
          {blog.likes === 1 ? 'like' : 'likes'} {blog.likes}{' '}
          <button
            onClick={() => {
              likeBlog(blog);
            }}
          >
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        <button onClick={()=>{removeBlog(blog)}}>remove</button>
      </div>
    </div>
  );
};

export default Blog;

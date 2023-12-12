import { useState, forwardRef, useImperativeHandle } from 'react';

const LoginForm = forwardRef(({ onLogin }, refs) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    onLogin({ username, password });
  };

  useImperativeHandle(refs, () => {
    return {
      setUsername,
      setPassword,
    };
  });

  return (
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
  );
});

export default LoginForm;

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnecdote } from '../requests';
import { useContext } from 'react';
import NotificationContext from '../NotificationContext';

const AnecdoteForm = () => {
  const [notification, dispatch] = useContext(NotificationContext);
  const queryClient = useQueryClient();

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
      dispatch({ type: 'SET', payload: `Added new anecdote` });
      setTimeout(() => {
        dispatch({ type: 'CLEAR' });
      }, 4000);
    },
    onError: () => {
      dispatch({ type: 'SET', payload: `too short of an anecdote` });
      setTimeout(() => {
        dispatch({ type: 'CLEAR' });
      }, 4000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;

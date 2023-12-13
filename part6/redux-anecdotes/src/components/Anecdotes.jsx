/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import { voteForAnecdote } from '../reducers/anecdoteReducer';

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  );
};

const Anecdotes = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector((state) => state.sort((a, b) => b.votes - a.votes));

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => dispatch(voteForAnecdote(anecdote.id))}
        />
      ))}
    </div>
  );
};

export default Anecdotes;

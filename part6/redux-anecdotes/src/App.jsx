import AnecdoteForm from './components/AnecdoteForm';
import Anecdotes from './components/Anecdotes';
import VisibilityFilter from './components/VisibilityFilter';

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <VisibilityFilter />
      <Anecdotes />
      <AnecdoteForm />
    </div>
  );
};

export default App;

import { useDispatch } from 'react-redux';
import { setFilter } from '../reducers/filterReducer';

const VisibilityFilter = () => {
  const dispatch = useDispatch();

  return (
    <div>
      filter: <input type='text' onChange={({ target }) => dispatch(setFilter(target.value))} />
    </div>
  );
};

export default VisibilityFilter;

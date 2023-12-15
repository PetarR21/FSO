import { filterChange } from '../reducers/filterReducer';
import { useDispatch } from 'react-redux';

const VisibilityFilter = () => {
  const dispatch = useDispatch();

  return (
    <div>
      filter <input type='text' onChange={({ target }) => dispatch(filterChange(target.value))} />
    </div>
  );
};

export default VisibilityFilter;

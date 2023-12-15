import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    set(state, action) {
      return action.payload;
    },
    clear(state, action) {
      return '';
    },
  },
});

export const { set, clear } = notificationSlice.actions;

export const setNotification = (content, seconds) => {
  return (dispatch) => {
    dispatch(set(content));
    setTimeout(() => {
      dispatch(clear());
    }, seconds * 1000);
  };
};

export default notificationSlice.reducer;

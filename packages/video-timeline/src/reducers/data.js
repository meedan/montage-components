import { createSlice } from 'redux-starter-kit';

// import baseData from '../data/baseData';
// import timelineData from '../data/timelineData';
// import newData from '../data/newData';

// import transcripts from '../data/transcripts';

import initialState from '../data/initalState.json';

// const initialState = {
//   ...baseData, // Base data from Laurian’s account
//   ...timelineData, // Base data from Laurian’s account
//   ...newData, // Add new data missing in the API
//   transcripts,
// };

// console.log(initialState);

const dataSlice = createSlice({
  initialState,

  reducers: {
    update: (state, { payload }) => ({ ...state, ...payload }),
    reset: () => initialState,
  },
});

const { actions, reducer } = dataSlice;
export const { update, reset } = actions;
export default reducer;

import { createSlice } from 'redux-starter-kit';

import baseData from '../data/baseData';
import timelineData from '../data/timelineData';
import newData from '../data/newData';

const initialState = window.angular
  ? {}
  : {
      ...baseData, // Base data from Laurian’s account
      ...timelineData, // Base data from Laurian’s account
      ...newData, // Add new data missing in the API
      // project: {
      //   ...baseData.project,
      //   projectplaces: [{ id: 2070, name: 'Syria', placeinstance_count: 1 }],
      //   projectclips: [{ id: 2070, name: 'Shareable', clipinstance_count: 1 }],
      // },
    };

const dataSlice = createSlice({
  initialState,

  reducers: {
    update: (state, { payload }) => ({ ...state, ...payload }),
    reset: () => initialState,
  },
});

console.log(dataSlice);

const { actions, reducer } = dataSlice;
export const { update, reset } = actions;
export default reducer;

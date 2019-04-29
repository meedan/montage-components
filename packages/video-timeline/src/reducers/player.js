import { createSlice } from 'redux-starter-kit';

const initialState = {
  duration: -1,
  currentTime: 0,
  playing: false,
  seeking: false,
  seekTo: null,
};

const playerSlice = createSlice({
  initialState: initialState,

  reducers: {
    play: state => ({ ...state, playing: true }),
    pause: state => ({ ...state, playing: false }),

    seekTo: (state, { payload: seekTo }) => ({...state, seekTo }),

    update: (state, { payload }) => ({...state, ...payload }),
    reset: () => initialState,
  },
})

const { actions, reducer } = playerSlice;
export const { play, pause, seekTo, update, reset } = actions;
export default reducer;

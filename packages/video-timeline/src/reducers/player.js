import { createSlice } from 'redux-starter-kit';

const initialState = {
  state: null, // https://developers.google.com/youtube/iframe_api_reference#Playback_status
  playbackRates: [1], // available playback rates
  playbackRate: 1,
  duration: 0,
  currentTime: 0,
  playing: false,
  seeking: false,
  seekTo: null,
  seekAhead: true,
  transport: null,
};

const playerSlice = createSlice({
  initialState: initialState,

  reducers: {
    play: (state, { payload: { transport = state.transport } = {} }) => ({
      ...state,
      transport,
      playing: true,
    }),

    pause: (state, { payload: { transport = state.transport } = {} }) => ({
      ...state,
      transport,
      playing: false,
    }),

    seekTo: (state, { payload }) => {
      const seekTo = isNaN(payload) ? payload.seekTo : payload;
      const transport = isNaN(payload)
        ? state.transport
        : payload.transport
        ? payload.transport
        : state.transport;
      const seekAhead = isNaN(payload) ? payload.seekAhead : state.seekAhead;
      return { ...state, transport, seekTo, seekAhead };
    },

    playbackRate: (state, { payload: playbackRate }) => ({
      ...state,
      playbackRate,
    }),

    duration: (state, { payload: duration }) => ({ ...state, duration }),
    timeupdate: (state, { payload: currentTime }) => ({
      ...state,
      currentTime,
    }),

    update: (state, { payload }) => ({ ...state, ...payload }),
    reset: () => initialState,
  },
});

const { actions, reducer } = playerSlice;
export const {
  play,
  pause,
  seekTo,
  playbackRate,
  duration,
  timeupdate,
  update,
  reset,
} = actions;
export default reducer;

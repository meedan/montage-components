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
  transport: null,
};

const playerSlice = createSlice({
  initialState: initialState,

  reducers: {
    // play: state => ({ ...state, playing: true }),
    play: (state, { payload: { transport = null } = {} }) => ({
      ...state,
      transport,
      playing: true,
    }),
    // pause: state => ({ ...state, playing: false }),
    pause: (state, { payload: { transport = null } = {} }) => ({
      ...state,
      transport,
      playing: false,
    }),

    // seekTo: (state, { payload: seekTo }) => ({ ...state, seekTo }),
    seekTo: (state, { payload }) => {
      const seekTo = isNaN(payload) ? payload.seekTo : payload;
      const transport = isNaN(payload) ? null : payload.transport;
      return { ...state, transport, seekTo };
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

console.log(playerSlice);

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

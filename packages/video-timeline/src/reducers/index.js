import { combineReducers } from 'redux';

import player from './player';
import data from './data';

const rootReducer = combineReducers({
  player,
  data,
});

export default rootReducer;

import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { createLogger } from 'redux-logger';
// import { save, load } from 'redux-localstorage-simple';

import rootReducer from './reducers';

// const SENTRY_DSN = null;

const logger = createLogger({
  predicate: (state, action) => !['update', 'timeupdate'].includes(action.type),
  duration: true,
  collapsed: true,
  diff: true,
});

export const configureAppStore = preloadedState => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [
      logger,
      // save({
      //   namespace: 'pizza2',
      //   states: ['data'],
      //   debounce: 1000,
      // }),
      ...getDefaultMiddleware(),
    ],
    preloadedState,
    // preloadedState: load({
    //   namespace: 'pizza2',
    //   states: ['data'],
    //   preloadedState,
    // }),
    devTools:
      process.env.NODE_ENV !== 'production'
        ? {
            trace: true,
          }
        : false,
  });

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
};

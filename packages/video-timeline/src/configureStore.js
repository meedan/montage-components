import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
// import RavenMiddleware from 'redux-raven-middleware';
import { createLogger } from 'redux-logger';

import rootReducer from './reducers';

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
      /* RavenMiddleware('my-sentry-dsn'),*/ logger,
      ...getDefaultMiddleware(),
    ],
    preloadedState,
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

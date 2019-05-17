import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
// import RavenMiddleware from 'redux-raven-middleware';
import { createLogger } from 'redux-logger';
import { save, load } from 'redux-localstorage-simple';

import rootReducer from './reducers';

// const SENTRY_DSN = null;

const logger = createLogger({
  predicate: (state, action) => !['update', 'timeupdate'].includes(action.type),
  duration: true,
  collapsed: true,
  diff: true,
});

export const configureAppStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [
      // RavenMiddleware(SENTRY_DSN),
      logger,
      save({
        namespace: 'pizza',
        states: ['data'],
        debounce: 1000,
      }),
      ...getDefaultMiddleware(),
    ],
    preloadedState: load({
      namespace: 'pizza',
      states: ['data'],
    }),
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

// TODO angular data
//   // FIXME:
//   // if (props.$scope) {
//   //   const data = props.$scope.$parent.ctrl;
//   //   return {
//   //     data,
//   //     duration: data.gdVideoData.duration,
//   //   };
//   // }

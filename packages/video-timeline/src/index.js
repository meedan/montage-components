import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { react2angular } from 'react2angular';
import { SnackbarProvider } from 'notistack';

import { configureAppStore } from './configureStore';
import App from './App';

const VideoTimeline = props => {
  const store = configureAppStore(
    props.$scope
      ? {
          ...props.$scope.$parent.ctrl,
        }
      : {}
  );

  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </Provider>
  );
};

const root = document.getElementById('react-root');
if (root) ReactDOM.render(<VideoTimeline />, root);

export const AngularVideoTimeline = react2angular(
  App,
  ['foo'],
  ['$scope', '$http']
);
window.AngularVideoTimeline = AngularVideoTimeline;

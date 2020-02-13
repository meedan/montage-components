import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';

import App from './App';

const root = document.getElementById('react-root');
if (root) {
  ReactDOM.render(
    <SnackbarProvider maxSnack={3}>
      <App ids="3,1,2" />
    </SnackbarProvider>,
    root
  );
} else {
  console.log('no react-root');
}

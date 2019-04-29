import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { configureAppStore } from './configureStore';

import App from './App';


const store = configureAppStore();

const root = document.getElementById('react-root');
if (root) ReactDOM.render(<Provider store={store}><App /></Provider>, root);

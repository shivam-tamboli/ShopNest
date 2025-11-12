import React from 'react';
import { createRoot } from 'react-dom/client'; // CHANGE THIS
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import "./App.css"

// GET THE ROOT ELEMENT
const container = document.getElementById('root');

// CREATE A ROOT
const root = createRoot(container);

// RENDER YOUR APP
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
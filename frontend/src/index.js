import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './pages/router/App';
import { MyStore } from "./Redux/MyStore";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={MyStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
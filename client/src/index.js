import React from 'react';
import ReactDOM from 'react-dom';

import './static/index.css';
import './static/skeleton/index.min.css';

import Header from './parts/Header';
import Content from './parts/Content';

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <Content />
  </React.StrictMode>,
  document.querySelector('.app')
);

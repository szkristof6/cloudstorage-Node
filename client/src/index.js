import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './static/index.css';
import './static/fontawesome/css/all.min.css'

import Header from './parts/Header';
import Content from './parts/Content';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route path="/drive" >
        <Header />
        <Content />
      </Route>
      <Route path="/login" exact >
        <h1>Hello</h1>
      </Route>
    </Router>
  </React.StrictMode>,
  document.querySelector('.app')
);

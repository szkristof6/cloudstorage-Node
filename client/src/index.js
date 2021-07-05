import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './static/index.css';
import './static/fontawesome/css/all.min.css';

import Header from './parts/Header';
import Content from './parts/Content';
import Login from './parts/Login';
import Register from './parts/Register';

import {
  AuthProvider,
  AuthContext
} from './services/authContext';

const UnauthenticatedRoutes = () => {
  <Switch>
    <Route path="/login" exact >
        <Login />
      </Route>
      <Route path="/register" exact >
        <Register />
      </Route>
  </Switch>
}

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/login" exact >
          <Login />
        </Route>
        <Route path="/register" exact >
          <Register />
        </Route>
        <Route path="/drive" >
          <Header />
          <Content />
      </Route>
    </Switch>
  );
};


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <AppRoutes />  
      </AuthProvider>    
    </Router>
  </React.StrictMode>,
  document.querySelector('.app')
);

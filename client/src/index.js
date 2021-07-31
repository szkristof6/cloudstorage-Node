import React, { Suspense, useContext, lazy } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import "./static/index.css";
import "./static/fontawesome/css/all.min.css";
import "bulma-pageloader";

import { AuthProvider, AuthContext } from "./services/authContext";
import { FetchProvider } from "./services/FetchContext";
import { FileProvider } from "./services/FileContext";
import Loader from "./parts/Loader";

const Header = lazy(() => import("./parts/Header"));
const Content = lazy(() => import("./parts/Content"));
const Login = lazy(() => import("./parts/Login"));
const Register = lazy(() => import("./parts/Register"));

const AuthenticatedRoute = ({ children, ...rest }) => {
  const authContext = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() =>
        authContext.isAuthenticated() ? (
          <React.Fragment>{children}</React.Fragment>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const AdminRoute = ({ children, ...rest }) => {
  const authContext = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() =>
        authContext.isAuthenticated() && authContext.isAdmin() ? (
          <React.Fragment>{children}</React.Fragment>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const AppRoutes = () => {
  return (
    <Suspense
      fallback={<Loader active={true} color="is-white" label="Töltés..." />}
    >
      <Switch>
        <AuthenticatedRoute path="/" exact>
          <Redirect to="/drive/my-drive" />
        </AuthenticatedRoute>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/register" exact>
          <Register />
        </Route>
        <AuthenticatedRoute path="/drive">
          <Header />
          <Content />
        </AuthenticatedRoute>
        <AdminRoute path="/admin" exact>
          <h1>Admin</h1>
        </AdminRoute>
      </Switch>
    </Suspense>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <FetchProvider>
          <FileProvider>
            <AppRoutes />
          </FileProvider>
        </FetchProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.querySelector(".app")
);

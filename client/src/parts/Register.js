import React from "react";
import * as Yup from 'yup';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { PublicFetch } from '../services/API';
import { AuthContext } from '../services/authContext';
import ReCAPTCHA from "react-google-recaptcha";
import Message from './form/Message';
import Logo from '../static/Logo.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faAt } from '@fortawesome/free-solid-svg-icons';

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email().required('Add meg az email címedet'),
  username: Yup.string().required('Add meg a felhasználóneved!'),
  password: Yup.string().required('Add meg a jelszavad!'),
});

const Register = () => {
  const authContext = useContext(AuthContext);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState();
  const [registerSuccess, setRegisterSuccess] = useState();
  const [redirectOnLogin, setRedirectOnLogin] = useState(false);

  const recaptchaRef = React.createRef();

  const recaptchaSubmit = async (credentials) => {
    try {
      const token = await recaptchaRef.current.executeAsync();

      submitCredentials({
        'g-recaptcha-response': token,
        ...credentials
      })
    } catch (error) {
      console.log(error);
    }
  }

  const submitCredentials = async (credentials) => {
    try {
      setRegisterLoading(true);
      const { data } = await PublicFetch.post('register', credentials);

      authContext.setAuthState(data);
      setRegisterError(null);
      setRegisterSuccess(data.message);
      setTimeout(() => {
        setRedirectOnLogin(true);
      }, 700);
    } catch (error) {
      setRegisterLoading(false);
      const { data } = error.response;
      setRegisterError(data.message);
      setRegisterSuccess('');
    }
  };

  return (
    <>
      {redirectOnLogin && <Redirect to="/drive/my-drive" />}
      <div className="container">
        <div className="logo is-justify-content-center login-logo">
          <figure className="image is-login">
            <img className="is-rounded" src={Logo} alt="Logo" />
          </figure>
          <div className="s-name">Martin Cloud</div>
        </div>
        <div className="columns is-justify-content-center">
          <div className="column is-three-fifths">
            <div className="card">
              <nav className="panel">
                <p className="panel-heading">Bejelentkezés</p>
                <div className="login">
                  <Formik
                    initialValues={{
                      username: '',
                      email: '',
                      password: '',
                    }}
                    onSubmit={(values) => recaptchaSubmit(values)}
                    validationSchema={RegisterSchema}
                  >
                    <Form>
                      {registerSuccess && <Message state="is-success" text={registerSuccess} />}
                      {registerError && <Message state="is-danger" text={registerError} />}
                      <ReCAPTCHA
                        sitekey="6LfrmuoeAAAAAPJXK7KZKT6KuUAPTZMjgF2MbpNZ"
                        ref={recaptchaRef}
                        size="invisible"
                      />
                      <div className="field is-horizontal">
                        <div className="field-label is-normal">
                          <label className="label">Felhasználónév</label>
                        </div>
                        <div className="field-body">
                          <div className="field">
                            <p className="control has-icons-left has-icons-right">
                              <Field
                                className="input"
                                name="username"
                                type="text"
                                placeholder="Add meg a felhasználónevedet"
                              />
                              <span className="icon is-small is-left">
                                <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                              </span>
                            </p>
                            <ErrorMessage name="username" component="div" />
                          </div>
                        </div>
                      </div>
                      <div className="field is-horizontal">
                        <div className="field-label is-normal">
                          <label className="label">Email cím</label>
                        </div>
                        <div className="field-body">
                          <div className="field">
                            <p className="control has-icons-left has-icons-right">
                              <Field
                                className="input"
                                name="email"
                                type="email"
                                placeholder="Add meg az email címedet"
                              />
                              <span className="icon is-small is-left">
                                <FontAwesomeIcon icon={faAt}></FontAwesomeIcon>
                              </span>
                            </p>
                            <ErrorMessage name="email" component="div" />
                          </div>
                        </div>
                      </div>
                      <div className="field is-horizontal">
                        <div className="field-label is-normal">
                          <label className="label">Jelszó</label>
                        </div>
                        <div className="field-body">
                          <div className="field">
                            <p className="control has-icons-left">
                              <Field
                                className="input"
                                name="password"
                                type="password"
                                placeholder="Add meg a jelszavad"
                              />
                              <span className="icon is-small is-left">
                                <FontAwesomeIcon icon={faLock}></FontAwesomeIcon>
                              </span>
                            </p>
                            <ErrorMessage name="password" component="div" />
                          </div>
                        </div>
                      </div>
                      <div className="login-button">
                        <button
                          disabled={registerLoading}
                          type="submit"
                          className="button is-medium is-rounded is-info is-fullwidth"
                        >
                          Registráció
                        </button>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

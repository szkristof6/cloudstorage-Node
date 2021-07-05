import * as Yup from 'yup';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { PublicFetch } from '../services/API';
import { AuthContext } from '../services/authContext';
import Message from './form/Message';
import Logo from '../static/Logo.png';

const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Add meg a felhasználóneved!'),
    password: Yup.string().required('Add meg a jelszavad!'),
});

const Login = () => {
    const authContext = useContext(AuthContext);
    const [loginSuccess, setLoginSuccess] = useState();
    const [loginError, setLoginError] = useState();
    const [redirectOnLogin, setRedirectOnLogin] = useState(
      false
    );
    const [loginLoading, setLoginLoading] = useState(false);

    const submitCredentials = async credentials => {
        try {
            setLoginLoading(true);
            const { data } = await PublicFetch.post('login', credentials);

            authContext.setAuthState(data);
            setLoginSuccess(data.message);
            setLoginError(null);
            setTimeout(() => {
                setRedirectOnLogin(true);
            }, 700);

        } catch (error) {
            setLoginLoading(false);
            const { data } = error.response;
            setLoginError(data.message);
            setLoginSuccess(null);
        }    
    }

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
                            <p className="panel-heading">
                                Bejelentkezés
                            </p>
                            <div className="login">
                                <Formik 
                                initialValues={{
                                    username: '',
                                    password: ''
                                  }}
                                  onSubmit={values =>
                                    submitCredentials(values)
                                  }
                                  validationSchema={LoginSchema}
                                >
                                    <Form>
                                        { loginSuccess && <Message state="is-success" text={loginSuccess} /> }
                                        {  loginError && <Message state="is-danger" text={ loginError} /> }
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
                                                            <i className="fas fa-user"></i>
                                                        </span>
                                                    </p>
                                                    <ErrorMessage name="username" component="div" />
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
                                                            <i className="fas fa-lock"></i>
                                                        </span>
                                                    </p>
                                                    <ErrorMessage name="password" component="div" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="login-button">
                                            <button disabled={loginLoading} type="submit" className="button is-medium is-rounded is-info is-fullwidth">Bejelentkezés</button>
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

export default Login;
import { createContext, useState } from "react";
import { useHistory } from "react-router-dom";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({children}) => {
		const history = useHistory();

    const expiresAt = localStorage.getItem('expiresAt');
    const userInfo = localStorage.getItem('userInfo');

    const [authState, setAuthState] = useState({
        token: null,
        expiresAt,
        userInfo: userInfo ? JSON.parse(userInfo) : {}
    });

    const setAuthInfo = ({token, userInfo, expiresAt}) => {
        localStorage.setItem('expiresAt', expiresAt);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setAuthState({
            token,
            expiresAt,
            userInfo
        });
    };

		const logout = () => {
			localStorage.removeItem('expiresAt');
			localStorage.removeItem('userInfo');

			setAuthState({
				token: null,
        expiresAt: null,
        userInfo: {}
			});
			history.push('/login');

		};

		  const isAuthenticated = () => {
    if (!authState.expiresAt) {
      return false;
    }
    return (
      new Date().getTime() / 1000 < authState.expiresAt
    );
  };

		const isAdmin = () => {
			return authState.userInfo.role === 'admin';
		};

    return (
        <Provider
            value = {{
                authState,
                setAuthState: authInfo => setAuthInfo(authInfo),
								isAuthenticated,
								logout,
								isAdmin,
            }}
        >
            {children}
        </Provider>
    );
};

export {AuthContext, AuthProvider}

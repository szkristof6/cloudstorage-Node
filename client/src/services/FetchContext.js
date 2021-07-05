import { createContext, useContext } from "react";
import axios from 'axios';
//import { AuthContext } from "./authContext";

const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({children}) => {
    const API_URL = '/api';

    /*
    const authContext = useContext(AuthContext);
    const { authState } = authContext;
    */
   
    const authAxios = axios.create({
        baseURL: API_URL
    });

    /*
    authAxios.interceptors.request.use(
        config => {               
            config.headers.Authorization = `Bearer ${authState.token}`;
            return config;
        },
        error => Promise.reject(error)
    );
    */

    return (
        <Provider
            value={{
                authAxios
            }}
        >
            {children}
        </Provider>
    );
};

export {
    FetchContext,
    FetchProvider
}
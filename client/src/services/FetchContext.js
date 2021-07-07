import { createContext } from "react";
import axios from 'axios';

const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({children}) => {
    const API_URL = '/api';

    const authAxios = axios.create({
        baseURL: API_URL
    });

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
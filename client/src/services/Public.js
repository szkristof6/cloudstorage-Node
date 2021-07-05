import axios from 'axios';

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:1337/api' : 'https://cloud.martinkult.hu/api';

const APIFetch = axios.create({
    baseURL: API_URL,
});

export {
    APIFetch,
};
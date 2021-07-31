import axios from "axios";

const API_URL = "/";

const PublicFetch = axios.create({
  baseURL: API_URL,
});

export { PublicFetch };

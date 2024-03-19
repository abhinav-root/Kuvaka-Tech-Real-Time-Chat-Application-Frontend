import axios from "axios";
import {Navigate} from "react-router-dom"

const BASE_URL = import.meta.env.VITE_EXPRESS_API_URL;
if (!BASE_URL) {
  throw new Error("VITE_EXPRESS_API_URL is not defined");
}

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    // If a token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // console.log({code: error.response.status})
      // If the response status is 401 (Unauthorized), redirect to the login page
      location.href = "/login"
      localStorage.removeItem("token")
    }
    return Promise.reject(error);
  }
);

export default instance;

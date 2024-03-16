import axios from "axios";

const BASE_URL = import.meta.env.VITE_EXPRESS_API_URL;
if (!BASE_URL) {
  throw new Error("VITE_EXPRESS_API_URL is not defined");
}

const instance = axios.create({
  baseURL: BASE_URL,
});

export default instance;

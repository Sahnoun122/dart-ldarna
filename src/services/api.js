import axios from "axios";

export const apiDarna = axios.create({
  baseURL: import.meta.env.VITE_API_DARNA,
  timeout: 5000,
});

export const apiTirelire = axios.create({
  baseURL: import.meta.env.VITE_API_TIRELIRE,
  timeout: 5000,
});

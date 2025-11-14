import axios from "axios";

const apiTirelire = axios.create({
  baseURL: import.meta.env.VITE_API_TIRELIRE,
});

const apiDarna = axios.create({
  baseURL: import.meta.env.VITE_API_DARNA,
});

console.log(import.meta.env.VITE_API_DARNA);
console.log(import.meta.env.VITE_API_TIRELIRE);

export { apiTirelire, apiDarna };

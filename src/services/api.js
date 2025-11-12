import axios from "axios";

const apiTirelire = axios.create({
  URL: process.env.REACT_APP_API_TIRELIRE,
});

const apiDarna = axios.create({
  URL: process.env.process.env.REACT_APP_API_DARNA,
});

export { apiTirelire, apiDarna };
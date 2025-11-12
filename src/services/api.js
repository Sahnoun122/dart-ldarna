import axios from "axios";

const tirelireAPI = axios.create({
  URL: process.env.REACT_APP_API_TIRELIRE,
});

const darnaAPI = axios.create({
  URL: process.env.process.env.REACT_APP_API_DARNA,
});

export {tirelireAPI , darnaAPI};
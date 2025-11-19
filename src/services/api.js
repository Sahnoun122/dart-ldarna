import axios from "axios";

export const apiDarna = axios.create({
  baseURL: import.meta.env.VITE_API_DARNA,
  timeout: 5000,
});

export const apiTirelire = axios.create({
  baseURL: import.meta.env.VITE_API_TIRELIRE,
  timeout: 5000,
});

apiDarna.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiDarna.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

apiTirelire.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiTirelire.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
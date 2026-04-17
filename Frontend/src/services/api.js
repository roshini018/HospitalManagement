// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5001",
//   withCredentials: true,
// });

// // Request interceptor - attach token from localStorage if available
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor – silently handle 401 without crashing
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     // Don't redirect on 401 from /me – AuthContext handles it
//     return Promise.reject(err);
//   }
// );

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true,
});

// Attach token from localStorage on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Silently handle 401 — AuthContext handles redirect
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;
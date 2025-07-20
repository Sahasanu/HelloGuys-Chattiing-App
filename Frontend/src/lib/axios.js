import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: "https://chat-backend-w071.onrender.com",
  withCredentials: true   // ✅ allows cookies to be sent with request
});
// export const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000",
//   withCredentials: true   // ✅ allows cookies to be sent with request
// });
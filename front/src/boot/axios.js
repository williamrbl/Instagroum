import axios from "axios";

export default ({ app, router, store }) => {
  // Set up Axios defaults or interceptors if needed
  axios.defaults.baseURL = "https://api.example.com";
  axios.defaults.headers.common["Authorization"] = "Bearer YOUR_ACCESS_TOKEN";

  // Add Axios instance to Vue prototype
  app.config.globalProperties.$axios = axios;
};

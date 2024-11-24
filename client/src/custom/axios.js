import axios from "axios";
import { toast } from "react-hot-toast";

const { REACT_APP_API_HOST } = process.env;
const customAxios = axios.create({
  baseURL: REACT_APP_API_HOST,
});

// Request interceptor for API calls
customAxios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken") || "";
    config.headers = {
      Authorization: `Bearer ${token}`,
    };

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

customAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    (error?.response?.data?.errors || []).forEach((real_error) => {
      (real_error?.messages || []).forEach((message) => {
        toast.error(message);
      });
    });
    return Promise.reject(error);
  }
);

export default customAxios;
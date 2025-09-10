import axios from "axios";

export const useAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

export const useCompiler = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

export const apiAxios = axios.create({
  baseURL: "http://127.0.0.1:7000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Add response interceptor for debugging
useAxios.interceptors.response.use(
  (response) => {
    console.log("Axios response:", {
      status: response.status,
      headers: response.headers,
      data: response.data instanceof Blob ? "Blob data" : response.data,
    });
    return response;
  },
  (error) => {
    console.error("Axios response error:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    return Promise.reject(error);
  },
);

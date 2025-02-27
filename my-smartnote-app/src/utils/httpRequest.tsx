import axios, { AxiosInstance } from "axios";

// Với Vite, biến môi trường phải bắt đầu bằng VITE_
const baseURL: string = import.meta.env.VITE_BASE_URL ?? "http://localhost:8080/api";

const httpRequest: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default httpRequest;

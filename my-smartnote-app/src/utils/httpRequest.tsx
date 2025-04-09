import axios, { AxiosInstance } from "axios";
import { refreshToken } from "../service/AuthenticationService";

const baseURL: string = import.meta.env.VITE_BASE_URL ?? "http://localhost:8080/api";

const httpRequest: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// let isRefreshing = false; 
// let refreshSubscribers: ((token: string) => void)[] = []; 

// const subscribeTokenRefresh = (callback: (token: string) => void) => {
//   refreshSubscribers.push(callback);
// };

// const onTokenRefreshed = (newToken: string) => {
//   refreshSubscribers.forEach((callback) => callback(newToken));
//   refreshSubscribers = [];
// };

// httpRequest.interceptors.request.use(
//   async (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const isTokenExpiringSoon = () => {
//         try {
//           // Kiểm tra token có phải là một chuỗi hợp lệ có 3 phần
//           const parts = token.split(".");
//           if (parts.length !== 3) {
//             throw new Error("Invalid token format");
//           }
          
//           const base64Url = parts[1];
//           const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//           const tokenData = JSON.parse(atob(base64)); 
          
//           const expTime = tokenData.exp * 1000;
//           return expTime - Date.now() < 30 * 60 * 1000; 
//         } catch (error) {
//           console.error("Error decoding token:", error);
//           return false;
//         }
//       };
      

//       if (isTokenExpiringSoon()) {
//         if (!isRefreshing) {
//           isRefreshing = true;
//           try {
//             console.log("Refreshing token");
//             const newToken = await refreshToken(token); // Gọi API refresh token
//             localStorage.setItem("token", newToken); // Lưu token mới
//             isRefreshing = false;
//             onTokenRefreshed(newToken); // Cập nhật token mới cho các request đang chờ
//           } catch (error) {
//             isRefreshing = false;
//             localStorage.removeItem("token");
//             window.location.href = "/login"; // Chuyển người dùng về trang login
//             throw error; // Ngừng xử lý request
//           }
//         }

//         // Xếp request vào hàng chờ cho đến khi token mới được làm mới
//         return new Promise((resolve) => {
//           subscribeTokenRefresh((newToken) => {
//             config.headers["Authorization"] = `Bearer ${newToken}`;
//             resolve(config);
//           });
//         });
//       }

//       // Gắn token hiện tại vào header
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


export default httpRequest;

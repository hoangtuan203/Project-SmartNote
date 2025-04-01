import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast để hiển thị thông báo
import "react-toastify/dist/ReactToastify.css"; // Import CSS của toastify
const GoogleCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");
    console.log("Google OAuth2 state received:", state);

    if (code) {
      console.log("Google OAuth2 code received:", code);
 
      axios
        .post<{ token: string; name: string; email: string; picture: string; accessToken: string; userId: string }>(
          "http://localhost:8080/api/auth/oauth2/callback/google",
          { code },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          console.log("Response from backend:", response.data);
          console.log("token access:", response.data.accessToken)
          toast.success("Login successful!");

          const { token, name, email, picture, accessToken, userId } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("username", name);
          localStorage.setItem("email", email);
          localStorage.setItem("avatar", picture);
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("userId", userId);
          
          const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
          console.log("Redirecting to:", redirectUrl);
          // localStorage.removeItem("redirectAfterLogin"); 
          
          setTimeout(() => {
            navigate(redirectUrl); // Chuyển hướng sau 1 giây
          }, 1000);
        })
        .catch((error) => {
          console.error(
            "Error during Google callback:",
            error.response || error
          );
          toast.error("Login failed. Please try again.");
          navigate("/login");
        });
    }
  }, [location, navigate]);

  return null;   
};

export default GoogleCallback;

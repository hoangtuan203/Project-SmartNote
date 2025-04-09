import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const FacebookCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    console.log("Facebook OAuth2 code received:", code);

    if (code) {
      axios
        .post<{ token: string; name: string; email: string; picture: string, accessToken : string, userId : string  }>(
          "http://localhost:8080/api/auth/oauth2/callback/facebook",
          { code },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          const { token, name, email, picture, accessToken, userId } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("username", name);
          localStorage.setItem("email", email);
          localStorage.setItem("avatar", picture);
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("userId", userId);
          localStorage.setItem("loginSuccess", "true")
          setTimeout(() => {
            navigate("/"); // Chuyển hướng sau 1 giây
          }, 1000);
        })
        .catch((error) => {
          console.error("Error during Facebook callback:", error.message);
          alert("Login failed. Please try again.");
          navigate("/login");
        });
    } else {
      console.error("No code found in URL");
      alert("Invalid login attempt. Please try again.");
      navigate("/login");
    }
  }, [location, navigate]);

  return null;
};

export default FacebookCallback;

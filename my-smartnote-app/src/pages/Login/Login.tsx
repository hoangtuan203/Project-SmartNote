import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { loginBasic } from "@/service/AuthenticationService";
import { toast } from "react-toastify"; // Import toast để hiển thị thông báo
import "react-toastify/dist/ReactToastify.css"; // Import CSS của toastify
import { ToastContainer } from "react-toastify";
import { FacebookConfig, OAuthConfig } from "@/config/config";
export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await loginBasic({ email, password });
      localStorage.setItem("email", email);
      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/"); // Chuyển hướng sau 1 giây
      }, 2000);
    } catch (error) {
      toast.error((error as string) || "Login failed, please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginGoogle = () => {
    const { clientId, authUri } = OAuthConfig;
    const targetUrl = `${authUri}?redirect_uri=http://localhost:5173/oauth2/redirect&response_type=code&client_id=${clientId}&scope=openid%20email%20profile`;
    window.location.href = targetUrl;
  };

  const handleFacebookLogin = () => {
    const { appId } = FacebookConfig;
    const redirectUri = "http://localhost:5173/oauth2/callback/facebook";
    const facebookLoginUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=public_profile,email`;
    window.location.href = facebookLoginUrl;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-900">
          Think it. Make it.
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Log in to your Smart Note account
        </p>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleLoginGoogle}
            className="flex items-center justify-center w-full p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
          >
            <FaGoogle className="mr-2 text-red-500" /> Continue with Google
          </button>
          <button 
          onClick={handleFacebookLogin}
          className="flex items-center justify-center w-full p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition">
            <FaFacebookF className="mr-2 text-blue-600" /> Continue with
            Facebook
          </button>
        </div>

        <div className="relative flex items-center justify-center my-6">
          <div className="w-full border-t border-gray-300"></div>
          <span className="absolute px-3 bg-white text-gray-500">or</span>
        </div>

        {/* Login Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email address"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full p-3 rounded-xl text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </div>

        {/* Link to Sign Up */}
        <p className="text-sm text-gray-500 text-center mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-500 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>

        <p className="text-xs text-gray-500 text-center mt-3">
          By continuing, you agree to the{" "}
          <a href="#" className="text-blue-500">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-500">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

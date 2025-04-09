import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerUser } from "@/service/UserService";
import { FacebookConfig, OAuthConfig } from "@/config/config";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import {CaptchaConfig} from "@/config/config"
import { verifyCaptcha } from "@/service/AuthenticationService";
export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA");
      return;
    }
  
    try {

      console.log(captchaToken)
      const captchaMessage = await verifyCaptcha(captchaToken);
    //   if (captchaMessage !== "Captcha verification passed.") {
    //     toast.error("Invalid CAPTCHA");
    //     return;
    //   }

      console.log("ok")
  
      await registerUser({ fullName, email, password, avatar: "avatar", provider: "local", role: "FULL_ACCESS" });
      toast.success("Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error("Registration failed, please try again!");
    }
  };
  

  
  const handleLoginGoogle = () => {
    const { clientId, authUri } = OAuthConfig;
    window.location.href = `${authUri}?redirect_uri=http://localhost:5173/oauth2/redirect&response_type=code&client_id=${clientId}&scope=openid%20email%20profile`;
  };

  const handleFacebookLogin = () => {
    const { appId } = FacebookConfig;
    window.location.href = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${appId}&redirect_uri=http://localhost:5173/oauth2/callback/facebook&response_type=code&scope=public_profile,email`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-900">Create Your Account</h2>
        <p className="text-gray-500 text-center mb-6">Sign up to start using Smart Note</p>

        <div className="space-y-3">
          <button onClick={handleLoginGoogle} className="flex items-center justify-center w-full p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition">
            <FaGoogle className="mr-2 text-red-500" /> Sign up with Google
          </button>
          <button onClick={handleFacebookLogin} className="flex items-center justify-center w-full p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition">
            <FaFacebookF className="mr-2 text-blue-600" /> Sign up with Facebook
          </button>
        </div>

        <div className="relative flex items-center justify-center my-6">
          <div className="w-full border-t border-gray-300"></div>
          <span className="absolute px-3 bg-white text-gray-500">or</span>
        </div>

        <div className="space-y-4">
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Full Name" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Email Address" />

          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 pr-10" placeholder="Password" />
            <button type="button" className="absolute right-3 top-3 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-4 w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Confirm Password" />
          
          <ReCAPTCHA sitekey={CaptchaConfig.siteKey} onChange={setCaptchaToken} />

          <button onClick={handleRegister} disabled={loading} className={`w-full p-3 rounded-xl text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account? <a href="/login" className="text-blue-500 font-medium hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}
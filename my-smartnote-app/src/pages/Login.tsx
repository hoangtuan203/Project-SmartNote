import { useState } from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-900">
          Think it. Make it.
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Log in to your Smart Note account
        </p>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button className="flex items-center justify-center w-full p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition">
            <FaGoogle className="mr-2 text-red-500" /> Continue with Google
          </button>
          <button className="flex items-center justify-center w-full p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition">
            <FaFacebookF className="mr-2 text-blue-600" /> Continue with Facebook
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
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email address"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          <button className="w-full p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">
            Log in
          </button>
        </div>

        {/* Link to Sign Up */}
        <p className="text-sm text-gray-500 text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 font-medium hover:underline">
            Sign up
          </a>
        </p>

        <p className="text-xs text-gray-500 text-center mt-3">
          By continuing, you agree to the{" "}
          <a href="#" className="text-blue-500">Terms & Conditions</a> and{" "}
          <a href="#" className="text-blue-500">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

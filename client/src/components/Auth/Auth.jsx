import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_AUTH_SERVICE_URL}/auth/login`,
        {
          identifier: formData.email,
          password: formData.password,
        }
      );
      const { token, role, isActive, organizationId, userId } = res.data;
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("isActive", isActive);
      localStorage.setItem("organizationId", organizationId);
      localStorage.setItem("userId", userId);
      // Decode token and store payload if needed
      const decoded = jwtDecode(token);
      localStorage.setItem("user", JSON.stringify(decoded));

      toast.success("Login successful!");
      // Redirect telecallers to their dashboard, admins to admin dashboard
      if (role === "telecaller") {
        navigate("/telecaller-dashboard");
      } else {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <img
              src="https://acs-liard.vercel.app/assets/ACS-OQj0FHDk.jpg"
              alt="Lead Management Logo"
              className="h-16 mx-auto"
            />
            <h1 className="text-3xl mt-3 text-center text-gray-800 font-bold">
              Welcome to Lead Management
            </h1>
            <p className="text-center text-gray-500 mt-2">
              Manage your leads, telecallers, and admins efficiently.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-semibold text-blue-700">
                {isSignup ? "Sign Up" : "Login"}
              </h2>
            </div>

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 font-poppins rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 font-poppins rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow"
            >
              LogIn
            </button>

            <div className="flex gap-4 mt-4">
              <a
                href="/privacy-policy"
                className="text-sm text-gray-500 hover:underline"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-and-conditions"
                className="text-sm text-gray-500 hover:underline"
              >
                Terms and Conditions
              </a>
            </div>
          </form>
        </div>

        {/* Right Side - Image & Text */}
        <div className="hidden lg:block  rounded-r-2xl relative">
          <div className="h-full flex flex-col justify-between">
            <iframe
              src="https://lottie.host/embed/00deded2-4e0f-44cf-b92f-770f252b0540/aOwoc6SXTI.lottie"
              className="w-[85%] h-full rounded-r-2xl"
              style={{ minHeight: "300px", border: "none" }}
              allowFullScreen
              title="Lead Management Animation"
            />{" "}
            <div className="absolute bottom-2 left-10  bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-blue-700">
                Your leads, your rules
              </h3>
              <p className="text-sm text-gray-600">
                Your lead data belongs to you, and our encryption ensures that.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;

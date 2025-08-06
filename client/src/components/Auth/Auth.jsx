import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy login: just navigate to admin-dashboard
    navigate("/admin-dashboard");
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
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

           
            {/* Role Selection */}
            <div className="flex items-center gap-6 justify-center mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleRoleChange}
                  className="accent-blue-600"
                />
                <span className="text-gray-700 font-medium">Admin</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="telecaller"
                  checked={formData.role === "telecaller"}
                  onChange={handleRoleChange}
                  className="accent-green-600"
                />
                <span className="text-gray-700 font-medium">Telecaller</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow"
            >
              {isSignup ? "Sign Up" : "Login"}
            </button>
            <p
              className="text-center text-gray-600 mt-2 cursor-pointer"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup
                ? "Already have an account? Login here"
                : "Don't have an account? Sign up here"}
            </p>
          </form>
        </div>

        {/* Right Side - Image & Text */}
        <div className="hidden lg:block bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-r-2xl relative">
          <div className="h-full flex flex-col justify-between">
            <video
              src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/man-doing-tyre-change-animation-download-in-lottie-json-gif-static-svg-file-formats--car-repairing-service-pack-services-animations-9748775.mp4"
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
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

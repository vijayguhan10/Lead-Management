import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side - Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <img
              src={"https://acs-liard.vercel.app/assets/ACS-OQj0FHDk.jpg"}
              alt="Revozen Logo"
              className="h-16 mx-auto"
            />
            <h1 className="text-3xl mt-3 text-center text-gray-800">
              Welcome to the Revozen Partner Management
            </h1>
          </div>

          <div>
            <div className="mb-4 text-center">
              <h1 className="text-3xl">{isSignup ? "Sign Up" : "Login"}</h1>
            </div>

            <div className="space-y-4">
              {isSignup && (
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={handleChange}
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
              </div>

              {isSignup && (
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-Type Password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="mt-8">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                {isSignup ? "Sign Up" : "Login"}
              </button>
              <p
                className="text-center text-gray-600 mt-4 cursor-pointer"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup
                  ? "Already have an account? Login here"
                  : "Don't have an account? Sign up here"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image & Text */}
        <div className="hidden lg:block bg-gradient-to-br rounded-r-2xl relative">
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
              <h3 className="font-semibold text-gray-800">
                Your data, your rules
              </h3>
              <p className="text-sm text-gray-600">
                Your data belongs to you, and our encryption ensures that
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;

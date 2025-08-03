import { useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthRightPanel from "./AuthRightPanel";

function Login() {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend integration, just UI
  };
  const [showPassword, setShowPassword] = useState(false);
  const roles = ["Admin", "Telecaller"];
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: roles[0],
    remember: false,
  });
  return (
    <div className="fixed inset-0 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center w-full h-full px-8 lg:px-24 bg-white">
        <div className="mb-12 flex flex-col items-center gap-6">
        <img src="/vite.svg" alt="Vite Logo" className="h-16 mb-2" />
          <h1 className="text-3xl text-center text-gray-800 leading-tight">
            Welcome to the Revozen Partner Management
          </h1>
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="mb-4 text-center">
            <h1 className="text-3xl">Login</h1>
          </div>
          <form className="space-y-4 w-full max-w-md" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="w-full mt-1">
              <Listbox
                value={formData.role}
                onChange={(role) => setFormData({ ...formData, role })}
              >
                <div className="relative border border-gray-300 rounded-lg">
                  <Listbox.Button className="w-full px-4 py-3 pr-10 text-left rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 cursor-pointer">
                    <span className="block truncate">{formData.role}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                      {roles.map((role) => (
                        <Listbox.Option
                          key={role}
                          className={({ active }) =>
                            `cursor-pointer select-none relative py-3 px-4 ${
                              active
                                ? "bg-blue-50 text-blue-900"
                                : "text-gray-900"
                            } border-b last:border-b-0 border-gray-200`
                          }
                          value={role}
                        >
                          {({ selected }) => (
                            <span
                              className={`block truncate ${
                                selected ? "font-semibold" : "font-normal"
                              }`}
                            >
                              {role}
                            </span>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            <div className="flex items-center justify-between w-full">
              <label className="flex items-center text-gray-700 relative select-none">
                <span
                  className="relative flex items-center justify-center mr-2"
                  style={{ minWidth: "1.25rem", minHeight: "1.25rem" }}
                >
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={(e) =>
                      setFormData({ ...formData, remember: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 appearance-none checked:bg-blue-600 checked:border-blue-600"
                  />
                  {formData.remember && (
                    <svg
                      className="w-3 h-3 text-white absolute pointer-events-none inset-0 m-auto"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-sm">Remember me for 30 days</span>
              </label>
              <Link
                to="#"
                className="!text-blue-600 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 active:text-blue-900 transition-colors duration-200 !hover:text-blue-800"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mt-2"
            >
              Login
            </button>
            <div className="text-center text-gray-600 mt-4">
              <span>Don't have an account?</span>
              <br />
              <Link
                to="/signup"
                className="!text-blue-600 font-semibold block mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 active:text-blue-900 transition-colors duration-200 !hover:text-blue-800"
              >
                Sign up here
              </Link>
            </div>
          </form>
        </div>
      </div>
      {/* Right Side - Image & Text */}
      <AuthRightPanel />
    </div>
  );
}

export default Login;

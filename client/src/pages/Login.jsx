import axios from "axios";
import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { RiLockPasswordLine, RiMailAiLine } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({});
  const [state, setState] = useState("Login");

  const { backendUrl, setIsLoggedIn, getUserData, getAuthStatus } =
    useContext(AppContext);

  const navigate = useNavigate();

  const onSubmitForm = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if (state === "Login") {
        const response = await axios.post(
          `http://localhost:3000/api/auth/login`,
          formData
        );
        console.log(response.data);

        if (response.data.success) {
          setIsLoggedIn(true);
          getUserData();
          getAuthStatus();
          navigate("/");
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(
          `${backendUrl}/api/auth/register`,
          formData
        );

        if (response.data.success) {
          setIsLoggedIn(true);
          getUserData();
          getAuthStatus();
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      if (error) {
        toast.error(error.response.data.message);
        console.error(error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gray-100">
      <img
        src={assets.logo}
        onClick={() => navigate("/")}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-gray-300 text-center mb-2">
          {state === "Sign Up" ? "Create account" : "Login"}
        </h2>
        <p className="text-gray-400 text-center mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account"}
        </p>
        <form onSubmit={onSubmitForm}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600 text-white">
              <span>
                <IoPersonOutline />
              </span>
              {/* <label htmlFor="">Email</label> */}
              <input
                className="bg-transparent outline-none"
                type="text"
                name="name"
                onChange={handleChange}
                required
                placeholder="Enter your store name"
                autoComplete="off"
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600 text-white">
            <span>
              <RiMailAiLine />
            </span>
            <input
              className="bg-transparent outline-none"
              type="email"
              name="email"
              required
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="off"
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-600 text-white">
            <span>
              <RiLockPasswordLine />
            </span>
            <input
              className="bg-transparent outline-none"
              type="password"
              name="password"
              required
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="off"
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className=" text-indigo-400 mb-4 cursor-pointer"
          >
            Forgot password?
          </p>
          <button
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium mb-4"
            type="submit"
          >
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-1">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="cursor-pointer text-blue-400 underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-1">
            Don&apos;t have an account yet?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="cursor-pointer text-blue-400 underline"
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "remixicon/fonts/remixicon.css";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Cookies from "js-cookie";
import { useGoogleLogin } from "@react-oauth/google";
import config from '../../../../config.json'

const CLIENT_ID = "1258869862025920572";
const REDIRECT_URI = `${config.front}/auth/discord/callback`;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

//   useEffect(() => {
    // const token = Cookies.get("token");
    // if (token) {
    //   navigate("/chat/5719829794927");
    // }
//   }, []);

  const discordLogin = () => {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=token&scope=identify%20email`;
    window.location.href = authUrl;
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log(JSON.stringify(data));
        const serverResponse = await fetch(
          `${config.url}/googlelogin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const result = await serverResponse.json();
        Cookies.set("token", result, {
          expires: 365 * 20,
          sameSite: "None",
          secure: true,
        });
        console.log(result);
        navigate("/chat");
      } catch (err) {
        console.log("Error fetching user data:", err);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const result = await response.json();
        // console.log("Success: ", result);
        Cookies.set("token", result, {
          expires: 365 * 20,
          sameSite: "None",
          secure: true,
        });
        toast.success("Login Successful", { position: "top-right" });
      } else if (response.status === 401) {
        setPasswordError(true);
        toast.error("Invalid Password", { position: "top-right" });
      } else if (response.status === 404) {
        setEmailError(true);
        toast.error("User not found", { position: "top-right" });
      } else if (response.status === 429) {
        toast.error("Too many requests. Try again in an hour", {
          position: "top-right",
        });
      } else {
        console.error("Unexpected response status: ", response.status);
        toast.error("Oh no.. Unexpected error", { position: "top-right" });
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  const handleEye = () => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };

  return (
    <>
      <main className="h-screen w-[100vw] bg-[#1f1f1f] flex overflow-scroll">
        <div className="flex-1 lg:block xss:hidden py-4 px-4 relative animate-in">
          <img
            src="background2.webp"
            alt="Geometric Art"
            className="inset-0 w-full h-full object-cover rounded-xl shadow-2xl"
          />
        </div>
        <div className="w-[550px] mx-auto sm:pt-10 xss:pt-4 px-4 h-screen animate-in">
          <Link to="/" className="flex items-center gap-1">
            <i className="ri-arrow-left-s-line text-2xl"></i>
            <span className="-translate-y-0.5">Back to Home</span>
          </Link>
          <div className="md:px-12 sm:px-10 xs:px-7 xss:px-[1vw]">
            <h1 className="sm:text-4xl xs:text-3xl xss:text-[1.75rem] mt-[5vh] font-pop font-semibold mb-2 whitespace-nowrap">
              <span className="bg-gradient-to-r from-[#ebebeb] to-[#c8c8c8] text-transparent bg-clip-text">
                Welcome Back!{" "}
              </span>
              👋
            </h1>
            <p className="text-gray-300">Enter your details below to Login</p>
            <div className="w-full  mt-[3vh] h-0.5 bg-[#e0e0e01d]"></div>

            <form className="mt-[2.5vh]">
              <div className="flex flex-col gap-4">
                <label
                  className="block text-gray-300 text-sm font-semibold translate-y-1.5"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onClick={() => setEmailError(false)}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@xyz.com"
                  className={`${
                    emailError ? "bg-[#3c0000]" : "bg-[#1f1f1f]"
                  } h-14 w-full flex items-center pl-6 text-xl rounded-full form-border text-white focus:outline-none focus:ring-0 focus:border-slate-100`}
                />
                <label
                  className="block text-gray-300 text-sm font-semibold translate-y-1.5"
                  htmlFor="password"
                >
                  Password
                </label>

                <div className="relative w-full rounded-full bg-[#1f1f1f] flex items-center form-border focus-within:ring-0 focus-within:outline-none focus-within:border-slate-100">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    onClick={() => setPasswordError(false)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${
                      passwordError ? "bg-[#3c0000]" : "bg-[#1f1f1f]"
                    } h-14 w-full pl-6 pr-12 text-lg text-white rounded-full focus:outline-none focus:ring-0 focus:border-slate-100`}
                  />
                  <button
                    type="button"
                    onClick={() => handleEye()}
                    className={`${
                      showPassword ? "ri-eye-line" : "ri-eye-close-line"
                    } absolute right-6 text-xl top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer`}
                  ></button>
                </div>

                <button
                  onClick={login}
                  className="login-button h-14 mt-[2vh] w-full flex items-center justify-center bg-[#ebebeb] rounded-full gap-3 text-lg font-semibold"
                >
                  <span className="text-black">Log In</span>
                </button>
                <Link
                  to="/register"
                  className="text-sm text-gray-200 font-mono"
                >
                  <span className="opacity-70">Don't have an account? </span>
                  <span className="text-gray-50 opacity-100">SignUp</span>
                </Link>
              </div>
            </form>
            <div className="w-full  mt-[1.4vh] h-0.5 bg-[#e0e0e01d]"></div>
            <button
              onClick={() => googleLogin()}
              className="h-14 mt-[2.5vh] w-full flex items-center justify-center border border-gray-400 hover:border-white transition-all duration-100 rounded-full gap-2"
            >
              <img src="google.webp" alt="" className="h-4/5" />
              <span className="font-semibold">Continue with Google</span>
            </button>
            <button
              onClick={() => discordLogin()}
              className="h-14 mt-[2vh] w-full flex items-center justify-center border border-gray-400 hover:border-white transition-all duration-100 rounded-full gap-3"
            >
              <img src="discord.webp" alt="" className="h-3/6" />
              <span className="font-semibold">Continue with Discord</span>
            </button>
          </div>
          <Toaster richColors theme="dark" />
        </div>
      </main>
    </>
  );
};

export default Login;

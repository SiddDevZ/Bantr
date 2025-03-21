import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Cookies from "js-cookie";
import { useGoogleLogin } from "@react-oauth/google";
import config from "../../../../config.json";

const CLIENT_ID = "1258869862025920572";
const REDIRECT_URI = `${config.front}/auth/discord/callback`;

const GuestLogin = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

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
        const serverResponse = await fetch(`${config.url}/googlelogin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
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

  const guestLogin = async (e) => {
    e.preventDefault();

    if (username.length < 3) {
      toast.error("Username cannot be less than 3 characters", {
        position: "top-right",
      });
      return;
    }

    try {
      const response = await fetch(`${config.url}/guestlogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.status === 200) {
        const result = await response.json();
        Cookies.set("token", result, {
          expires: 1,
          sameSite: "None",
          secure: true,
        });
        toast.success("Logged in as guest!", { position: "top-right" });
        navigate("/chat");
      } else if (response.status === 429) {
        toast.error("Too many requests. Try again in an hour", {
          position: "top-right",
        });
      } else {
        console.error("Unexpected response status: ", response.status);
        toast.error("Oh no.. Unexpected error", { position: "top-right" });
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <>
      <main className="h-screen w-[100vw] bg-[#1f1f1f] flex overflow-scroll">
        <div className="flex-1 lg:block xss:hidden py-4 px-4 relative animate-in">
          <img
            src="background.webp"
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
            <h1 className="sm:text-4xl xs:text-3xl xss:text-[1.65rem]  mt-[2vh] font-pop font-semibold mb-1 whitespace-nowrap">
              <span className="bg-gradient-to-r from-[#ebebeb] to-[#c8c8c8] text-transparent bg-clip-text">
                Guest Login
              </span>
              👋
            </h1>
            <p className="text-gray-300">
              Enter a username to continue as guest
            </p>
            <div className="w-full  mt-[3vh] h-0.5 bg-[#e0e0e01d]"></div>

            <form className="mt-[2vh]" onSubmit={guestLogin}>
              <div className="flex flex-col gap-2">
                <label
                  className="block text-gray-300 text-sm font-semibold translate-y-1.5"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  placeholder="yourname"
                  className="h-14 w-full flex items-center pl-6 text-xl rounded-full form-border bg-[#1f1f1f] text-white focus:outline-none focus:ring-0 focus:border-slate-100"
                />
                <button
                  type="submit"
                  className="login-button mb-10 h-14 mt-[2vh] w-full flex items-center justify-center bg-[#ebebeb] rounded-full gap-3 text-lg font-semibold"
                >
                  <span className="text-black">Start As Guest</span>
                </button>
                <Link to="/login" className="text-sm text-gray-200 font-mono">
                  <span className="opacity-70">Already have an Account? </span>
                  <span className="text-gray-50 opacity-100">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="text-sm text-gray-200 font-mono"
                >
                  <span className="opacity-70">Wanna create an account instead? </span>
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

export default GuestLogin;
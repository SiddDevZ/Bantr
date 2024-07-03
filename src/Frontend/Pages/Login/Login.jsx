import React from 'react'
import './Login.css'
import 'remixicon/fonts/remixicon.css'
import { Link } from 'react-router-dom'
// bg-[#f9fafc]
const Login = () => {
  return (
    <>
        <main className='h-screen w-[100vw] bg-[#1f1f1f] flex overflow-scroll'>
            <div className="flex-1 py-4 px-4 relative animate-in">
                <img 
                  src="background.jpg" 
                  alt="Geometric Art" 
                  className="inset-0 w-full h-full object-cover rounded-xl shadow-2xl"
                />
            </div>
            <div className='w-[550px] py-10 px-4 h-screen animate-in'>
                <Link to="/" className='flex items-center gap-1'><i className="ri-arrow-left-s-line text-2xl"></i><span className='-translate-y-0.5'>Back to Home</span></Link>
                <div className='px-12'>
                    <h1 className='text-4xl mt-[5vh] font-pop font-semibold mb-2'><span className='bg-gradient-to-r from-[#ebebeb] to-[#c8c8c8] text-transparent bg-clip-text'>Welcome Back! </span>👋</h1>
                    <p className='text-gray-300'>Enter your details below to Login</p>
                    <div className="w-full  mt-[3vh] h-0.5 bg-[#e0e0e01d]"></div>
                    <form className='mt-[2.5vh]'>
                        <div className='flex flex-col gap-4'>
                            <label className="block text-gray-300 text-sm font-semibold translate-y-1.5" htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder='yourname@xyz.com' className='h-14 w-full flex items-center pl-4 text-xl rounded-full form-border bg-[#1f1f1f] text-white focus:outline-none focus:ring-0 focus:border-slate-100' />
                            <label className="block text-gray-300 text-sm font-semibold translate-y-1.5" htmlFor="password">Password</label>
                            <input type="password" id="password" placeholder='••••••••' className='h-14 w-full flex items-center pl-4 text-lg bg-[#1f1f1f] form-border text-white rounded-full focus:outline-none focus:ring-0 focus:border-slate-100' />
                            {/* <button className='underline text-gray-300 flex justify-end'>Forgot Password?</button> */}
                            <button className='login-button h-14 mt-[2vh] w-full flex items-center justify-center bg-[#ebebeb] rounded-full gap-3 text-lg font-semibold'><span className='text-black'>Log In</span></button>
                            <Link to="/" className='text-sm text-gray-200 font-mono'><span className='opacity-70'>Don't have an account? </span><span className='text-gray-50 opacity-100'>SignUp</span></Link>
                        </div>
                    </form>
                    <div className="w-full  mt-[1.4vh] h-0.5 bg-[#e0e0e01d]"></div>
                    <button className='h-14 mt-[2.5vh] w-full flex items-center justify-center border border-gray-400 hover:border-white transition-all duration-100 rounded-full gap-2'><img src="google.webp" alt="" className='h-4/5' /><span className='font-semibold'>Continue with Google</span></button>
                    <button className='h-14 mt-[2vh] w-full flex items-center justify-center border border-gray-400 hover:border-white transition-all duration-100 rounded-full gap-3'><img src="discord.webp" alt="" className='h-3/6' /><span className='font-semibold'>Continue with Discord</span></button>
                </div>
            </div>
        </main>
    </>
  )
}

export default Login

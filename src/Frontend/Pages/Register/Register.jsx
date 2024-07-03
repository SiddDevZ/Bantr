import React, { useState } from 'react'
import './Register.css'
import 'remixicon/fonts/remixicon.css'
import { Link } from 'react-router-dom'

const Register = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        let value = e.target.value.replace(/\s/g, '');
        if (value.length > 14) {
            console.log("Limit reached")
            value = value.substring(0, 16);
        }
        setUsername(value);
    };

    const handleEye = () => {
        if (showPassword) {
            setShowPassword(false);
        } else {
            setShowPassword(true);
        }
    }
  
    return (
        <>
            <main className='h-screen w-[100vw] bg-[#1f1f1f] flex overflow-scroll'>
                <div className="flex-1 lg:block xss:hidden py-4 px-4 relative animate-in">
                    <img 
                      src="e.jpg" 
                      alt="Geometric Art" 
                      className="inset-0 w-full h-full object-cover rounded-xl shadow-2xl"
                    />
                </div>
                <div className='w-[550px] mx-auto pt-10 px-4 h-screen animate-in'>
                    <Link to="/" className='flex items-center gap-1'><i className="ri-arrow-left-s-line text-2xl"></i><span className='-translate-y-0.5'>Back to Home</span></Link>
                    <div className='md:px-12 sm:px-10 xs:px-7 xss:px-[1vw]'>
                        <h1 className='text-4xl mt-[2vh] font-pop font-semibold mb-1 whitespace-nowrap'><span className='bg-gradient-to-r from-[#ebebeb] to-[#c8c8c8] text-transparent bg-clip-text'>Create New Account! </span>😎</h1>
                        <p className='text-gray-300'>Enter your details below to Register</p>
                        <div className="w-full  mt-[3vh] h-0.5 bg-[#e0e0e01d]"></div>
                        
                        <form className='mt-[2vh]'>
                            <div className='flex flex-col gap-2'>
                                <label className="block text-gray-300 text-sm font-semibold translate-y-1.5" htmlFor="username">Username</label>
                                <input type="text" id="username" value={username} onChange={handleUsernameChange} placeholder='' className='h-14 w-full flex items-center pl-6 text-xl rounded-full form-border bg-[#1f1f1f] text-white focus:outline-none focus:ring-0 focus:border-slate-100' />
                                <label className="block text-gray-300 text-sm font-semibold translate-y-1.5" htmlFor="email">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='yourname@xyz.com' className='h-14 w-full flex items-center pl-6 text-xl rounded-full form-border bg-[#1f1f1f] text-white focus:outline-none focus:ring-0 focus:border-slate-100' />
                                <label className="block text-gray-300 text-sm font-semibold translate-y-1.5" htmlFor="password">Password</label>

                                <div class="relative w-full rounded-full bg-[#1f1f1f] flex items-center form-border focus-within:ring-0 focus-within:outline-none focus-within:border-slate-100">
                                  <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" class="h-14 w-full pl-6 pr-12 text-lg bg-[#1f1f1f] text-white rounded-full focus:outline-none focus:ring-0 focus:border-slate-100"/>
                                  <button type="button" onClick={() => handleEye()} className={`${showPassword ? 'ri-eye-line' : 'ri-eye-close-line'} absolute right-6 text-xl top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer`}></button>
                                </div>

                                <button className='login-button h-14 mt-[2vh] w-full flex items-center justify-center bg-[#ebebeb] rounded-full gap-3 text-lg font-semibold'><span className='text-black'>Register</span></button>
                                <Link to="/login" className='text-sm text-gray-200 font-mono'><span className='opacity-70'>Already have an Account? </span><span className='text-gray-50 opacity-100'>Login</span></Link>
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

export default Register

import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'

const Footer = ({ onContactClick }) => {
  return (
    <footer className='lg:px-[5rem] md:px-[5rem] sm:px-[3.5rem] xs:px-[3rem] xss:px-[1rem] mb-20'>
        <div className='footer-parent'>
            <div className='mt-10 mb-10 flex justify-between'>
                <div>
                    <div className='flex w-[20vw] items-center gap-4'>
                        <img src="log.png" alt="Logo" className="md:w-16 xs:w-14 xss:w-10" />
                        <h1 className='md:text-4xl xs:text-3xl xss:text-2xl font-pop font-semibold'>Bantr</h1>
                    </div>
                </div>
                <div className='md:w-[55%] sm:w-[45%] xs:w-[43%] xss:w-[47%] lg:pr-[15vw] md:pr-[10vw] sm:pr-[5vw] xs:pr-[0vw] xss:pr-[3vw] mt-4 h-28 flex -translate-y-2 justify-between'>
                    <div className='flex flex-col justify-between items-center'>
                        <Link to="/" className='footer-glow md:text-2xl sm:text-xl xs:text-lg text-[#e8e8e8] transition-all duration-300 hover:text-white font-pop'>Get Started</Link>
                        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target='_blank' className='footer-glow md:text-2xl sm:text-xl xs:text-lg text-[#e8e8e8] transition-all duration-300 hover:text-white font-pop'>Careers</a>
                    </div>
                    <div className='flex flex-col justify-between items-center'>
                        <button onClick={onContactClick} className='footer-glow md:text-2xl sm:text-xl xs:text-lg text-[#e8e8e8] transition-all duration-300 hover:text-white font-pop'>Contact</button>
                        <Link to="/login" className='footer-glow md:text-2xl sm:text-xl xs:text-lg text-[#e8e8e8] transition-all duration-300 hover:text-white font-pop'>Login</Link>
                    </div>
                </div>
            </div>
        </div>
        <div className='mt-6 flex xss:justify-center sm:justify-start'>
            <h1 className='text-xl font-pop'>Made by <a target="_blank" href="https://github.com/SiddDevZ" className='font-mono footer-underline'>Siddharth Jorwal</a> ❤️</h1>
        </div>
    </footer>
  )
}


export default Footer

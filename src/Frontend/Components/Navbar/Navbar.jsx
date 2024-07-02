import React, { useEffect } from 'react';
import './Navbar.css'

const Navbar = () => {
    useEffect(() => {
        const handleScroll = () => {
          const scrollPosition = window.scrollY;
          const threshold = 300;
          const navElement = document.querySelector('nav');
    
          const blurAmount = Math.min((scrollPosition / threshold) * 10, 10);
          navElement.style.backdropFilter = `blur(${blurAmount}px)`;
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
      <nav className='flex w-full xss:px-5 xs:px-10 sm:px-3 md:px-10 lg:px-28 py-3 nav items-center justify-between'>
          <div className='flex items-center justify-between w-[127px]'>
            <img src="logo.png" alt="Logo" className="w-full h-full" />
            <h1 className='text-2xl font-pop font-semibold'>Bantr</h1>
          </div>

          <div className='sm:flex xss:hidden font-pop font-semibold text-md gap-14 text-md'>
            <h3 className='text-white hover:underline cursor-pointer'>Home</h3>
            <h3 className='text-white hover:underline cursor-pointer'>Contact</h3>
            <h3 className='text-white hover:underline cursor-pointer'>Careers</h3>
          </div>

          <button className='px-5 py-2.5 rounded-full btn'>
            <h3 className='font-pop font-semibold text-black'>Open Bantr</h3>
          </button>
      </nav>
    )
}

export default Navbar

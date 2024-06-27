import React, { useEffect } from 'react';
import './Landing.css'
import 'remixicon/fonts/remixicon.css'
import Monitor from '../../Components/Monitor/Monitor';

const Landing = () => {

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = 300;

      if (scrollPosition > threshold) {
        document.body.classList.add('scrolled');
      } else {
        document.body.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="h-screen w-full bg-grid-white/[0.06] relative flex">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-yell [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black)]"></div>
        <div className='z-20'>

          <nav className='flex w-full sm:px-20 md:px-24 lg:px-28 nav items-center justify-between'>
            <div className='flex items-center justify-between w-[127px]'>
              <img src="logo.png" alt="Logo" className="w-full h-full" />
              <h1 className='text-2xl font-pop font-semibold'>Bantr</h1>
            </div>

            <div className='flex font-pop font-semibold text-md gap-14 text-md'>
              <h3 className='text-white hover:underline cursor-pointer'>Home</h3>
              <h3 className='text-white hover:underline cursor-pointer'>Contact</h3>
              <h3 className='text-white hover:underline cursor-pointer'>Careers</h3>
            </div>

            <button className='px-5 py-2.5 rounded-full btn'>
              <h3 className='font-pop font-semibold text-black'>Open Bantr</h3>
            </button>
          </nav>

          <div className='emoji-container'>
            <img src="skull.png" alt="" className='ae e1'/>
            <img src="sunglasses.png" alt="" className='ae e2'/>
            <img src="laugh.png" alt="" className='ae e3'/>
          </div>

          <main className='flex w-[100vw] z-500 h-[80vh] items-center mt-[10vh] justify-between sm:px-[5.5rem] md:px-[7rem] lg:px-[8rem]'>
            <div className=''>
              <h1 className='tex font-pop'>THE PLACE<br />TO SHARE FUN<br />AND HUMOR</h1>
              <p className='font-pop font-normal text-lg w-[450px] mt-4 text-gray-200'>Bantr is a vibrant community to make new friends and connect with like-minded people. We like to spread positivity and fun by humor and laughter.</p>
              <button className='bg-[#FAC304] px-6 py-3 mt-5 rounded-full flex'><h1 className='text-black font-semibold text-xl'>Get Started</h1><i class="ri-arrow-right-line text-black text-2xl font-bold ml-2"></i></button>
            </div>
            <div className='monitor-container'>
              <div className='background'></div>
              {/* <Monitor /> */}
              <h1 className='flex justify-center items-center h-[100%] opacity-70'>(removed monitor for performance reasons)</h1>
            </div>
          </main>

          <div className='h-[100vh] bg-red-500'></div>
        </div>
      </div>
    </>
  )
}

export default Landing

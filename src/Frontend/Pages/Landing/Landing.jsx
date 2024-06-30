import React, { useEffect } from 'react';
import './Landing.css'
import 'remixicon/fonts/remixicon.css'
import Monitor from '../../Components/Monitor/Monitor';

const Landing = () => {

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
    <>
      <div className="h-max w-full bg-grid-white/[0.06] relative flex">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-yell [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black)]"></div>
        <div className='z-20 animate-in'>

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
            <img src="heart.png" alt="" className='ae e4'/>
            <img src="eyes.png" alt="" className='ae e5'/>
          </div>

          <main className='flex w-[100vw] z-500 min-h-[550px] items-center mt-[10vh] justify-between md:justify-center sm:px-[5.5rem] md:px-[4rem] lg:px-[7.5vw] xss:px-[3vw]'>
            <div className='w-full'>
              <h1 className='tex xs:text-[9vw] xss:text-[10vw] sm:text-6xl font-pop whitespace-nowrap xss:text-center xss:w-full lg:text-left'>THE PLACE<br />TO SHARE FUN<br />AND HUMOR</h1>
              <p className='font-pop font-normal text-lg xss:text-xs sm:text-base sm:w-[90%] md:w-[70%] w-[450px] xss:mt-2 sm:mt-4 text-gray-200 xss:text-center xss:w-[90%] lg:text-left lg:whitespace-normal lg:mx-0 xss:mx-auto'>Bantr is a vibrant community to make new friends and connect with like-minded people. We like to spread positivity and fun by humor and laughter.</p>
              <button className='bg-[#FAC304] px-6 py-3 mt-5 xss:mx-auto lg:mx-0 rounded-full flex'><h1 className='text-black font-semibold text-xl'>Get Started</h1><i class="ri-arrow-right-line text-black text-2xl font-bold ml-2"></i></button>
            </div>
            <div className='monitor-container md:hidden sm:hidden xss:hidden lg:block'>
              <div className='background'></div>
              {/* <Monitor /> */}
              <h1 className='flex justify-center items-center h-[100%]'>(removed monitor temporarily)</h1>
            </div>
          </main>

          <div className='mt-10 mb-36 lg:flex xss:block w-[100vw] z-500 justify-between lg:px-[8rem]'>
            <div className='flex justify-center mr-20 xss:mr-0 xss:mb-10'>
              <img src="log.png" alt="" className='flex h-[12vw] ' />
            </div>
            <div className='lg:w-[70%] xss:w-full max-w-[700px]'>
              <h1 className='font-pop font-black lg:text-6xl whitespace-nowrap xs:text-[9vw] xss:text-[9vw] md:text-6xl xss:text-center xss:w-full lg:text-left'>WHAT IS BANTR?</h1>
              <p className='font-pop font-normal text-md leading-[1.7rem] mt-4 w-[100%] max-w-[39rem] text-gray-200'>Bantr is a dynamic online community designed for teens to connect, share, and enjoy the lighter side of life. It's a place where humor thrives, friendships blossom, and creativity knows no bounds. Whether you're swapping memes, engaging in playful</p>
              <div className='flex mt-2'>
                <img src="star.png" alt="" className='h-8' />
                <img src="star.png" alt="" className='h-8' />
                <img src="star.png" alt="" className='h-8' />
                <img src="star.png" alt="" className='h-8' />
                <img src="star.png" alt="" className='h-8' />
              </div>
            </div>
          </div>

          <div className='mb-28'>
            <h1 className='font-pop font-black text-6xl whitespace-nowrap text-center'>WHY BANTR?</h1>
            <div className='flex justify-between sm:px-[5.5rem] md:px-[6rem] lg:px-[8rem] mt-14'>
              <div className='w-1/3 flex flex-col items-center justify-center'>
                <img src="/why/lock.png" alt="" className='h-[7vw]' />
                <h1 className='font-pop font-semibold mb-1 mt-1 text-2xl whitespace-nowrap'>E2E Encryption</h1>
                <p className='w-[70%] text-center text-gray-200'>At Bantr, your privacy and security are our top priorities. your messages and shared content are always protected</p>
              </div>
              <div className='w-1/3 flex flex-col items-center justify-center'>
                <img src="/why/channel.png" alt="" className='h-[7vw]' />
                <h1 className='font-pop font-semibold mb-1 text-2xl whitespace-nowrap'>Organized Channels</h1>
                <p className='w-[70%] text-center text-gray-200'>We have channels for all topics.<br />Easily find and join channels that match your interests. With like minded people.</p>
              </div>
              <div className='w-1/3 flex flex-col items-center justify-center'>
                <img src="/why/home.png" alt="" className='h-[7vw]' />
                <h1 className='font-pop font-semibold translate-y-2 mb-2 mt-1 text-2xl whitespace-nowrap'>Best Community</h1>
                <p className='w-[70%] text-center text-gray-200'>Meet like minded people at Bantr<br />Join a community of memers where friendships grow and every interaction is filled with smiles</p>
              </div>
            </div>
          </div>

          <div className='mb-16 flex flex-col '>
            <h1 className='font-pop font-black text-[3.5rem] leading-[1.13] whitespace-nowrap text-center'>WHAT ARE YOU WAITING FOR?<br /><span className='bg-gradient-to-r from-[#EEC800] to-[#FF8A00] text-transparent bg-clip-text'>JOIN US NOW!</span></h1>
            <button className='bg-[#ffffff] m-auto px-7 py-3 mt-5 rounded-full flex'><h1 className='text-black font-semibold text-xl'>Get Started</h1><i class="ri-arrow-right-line text-black text-2xl font-bold ml-2"></i></button>
          </div>

          <div className='mb-72'>
            <h1 className='text-center text-[16vw] tracking-wider font-pop leading-none opacity-25 bg-gradient-to-b from-[#FFFFFF] to-[#414141] text-transparent bg-clip-text'>Contact Us</h1>
            <div className='sm:px-[5.5rem] md:px-[7rem] lg:px-[8rem] -translate-y-14'>
              <div className='flex justify-between'>
                <div className='flex flex-col justify-between'>
                  <div>
                    <h1 className='leading-none font-pop font-bold text-[5vw] text-gray-100'>Reach Out <i class="ri-arrow-right-up-line bg-gradient-to-bl text-8xl from-[#FFFFFF] to-[#414141] text-transparent bg-clip-text"></i></h1>
                    <p className='mt-3 text-[1.2vw] w-[35vw] text-[#d2d2d2] leading-[1.2] opacity-90'>Have a question or need assistance? Whether you're seeking support, have an inquiry, or simply want to connect, feel free to reach out. I'm always here to help and will make every effort to respond to you. I look forward to connecting with you soon.</p>
                  </div>
                  <div className='mt-2 flex-col mb-5'>
                    <div className='flex items-center mb-4'>
                      <div className='flex w-[2.7vw] h-[2.7vw] bg-[#DEDEDE] mr-5 rounded-full justify-center items-center'>
                        <img src="check.png" alt="" className='' />
                      </div>
                      <h1 className='font-pop font-medium text-lg'>Timely Response</h1>
                    </div>
                    <div className='flex items-center'>
                      <div className='flex w-[2.7vw] h-[2.7vw] bg-[#DEDEDE] mr-5 rounded-full justify-center items-center'>
                        <img src="check.png" alt="" className='w-' />
                      </div>
                      <h1 className='font-pop font-medium text-lg'>Personalized response</h1>
                    </div>
                  </div>
                  <div className='flex mb-5'>
                    <div className='flex w-[3.5vw] h-[3.5vw] bg-[#EBEBEB] mr-5 rounded-full justify-center items-center blur-thing'>
                      <i class="ri-github-fill text-black text-[2.7vw]"></i>
                    </div>
                    <div className='flex w-[3.5vw] h-[3.5vw] bg-[#EBEBEB] mr-5 rounded-full justify-center items-center'>
                      <i class="ri-twitter-x-line text-black text-[2.2vw]"></i>
                    </div>
                    <div className='flex w-[3.5vw] h-[3.5vw] bg-[#EBEBEB] mr-5 rounded-full justify-center items-center'>
                      <i class="ri-instagram-line text-black text-[2.35vw]"></i>
                    </div>
                  </div>
                </div>

                <div className='w-[45%] border border-[#c0c0c0] p-7 rounded-xl'>
                  <form className='space-y-6'>
                    <div className='flex justify-between space-x-3'>
                      <div className='w-1/3'>
                        <input type="text" id="name" placeholder='Name' className='h-12 block bg-[rgba(103,103,103,0.2)] pl-4 w-full border rounded-2xl shadow-sm text-gray-100' />
                      </div>
                      <div className='w-2/3'>
                        <input type="email" id="email" placeholder='Email' className='h-12 block bg-[rgba(103,103,103,0.2)] pl-4 w-full border rounded-2xl shadow-sm text-gray-100' />
                      </div>
                    </div>
                    <div>
                      <textarea id="message" rows="4" placeholder='Message' className='mt-1 block w-full bg-[rgba(103,103,103,0.2)] pl-4 pt-2 h-72 border rounded-2xl shadow-sm text-gray-100'></textarea>
                    </div>
                    <div className='flex justify-center'>
                      <button className='flex-grow bg-red-500 bg-gradient-to-r from-[#FFFFFF] to-[#B7B7B7] font-pop text-xl h-12 rounded-full text-black'>Submit</button>
                    </div>
                  </form>
                </div>
                
              </div>
            
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Landing

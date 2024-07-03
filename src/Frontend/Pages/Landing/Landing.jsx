import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css'
import 'remixicon/fonts/remixicon.css'
import Monitor from '../../Components/Monitor/Monitor';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Landing = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Webhook URL:', process.env.REACT_APP_DISCORD_WEBHOOK_URL);
    // const link = process.env.REACT_APP_DISCORD_WEBHOOK_URL;
    const link = import.meta.env.VITE_URL;

    const payload = {
      content: `# **__${name}\__**\n**${email}**\n\`\`\`${message}\`\`\``
    };

    try {
      const response = await fetch(link, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        toast.success('Message sent successfully!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        setName('');
        setEmail('');
        setMessage('');
      } else {
        toast.error("Failed to send message. Please try again.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred. Please try again.", {position: "bottom-right", autoClose: 10000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark", transition: Bounce,});
    }
  }


  return (
    <>
      <div className="h-max w-full bg-grid-white/[0.06] relative flex">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-yell [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black)]"></div>
        <div className='z-20 animate-in'>

          <Navbar />

          <div className='emoji-container'>
            <img src="iphone_emojis/skull.png" alt="" className='ae e1 sm:min-h-[150px] xss:min-h-[120px]'/>
            <img src="iphone_emojis/sunglasses.png" alt="" className='ae e2 sm:min-h-[150px] xss:min-h-[120px] '/>
            <img src="iphone_emojis/laugh.png" alt="" className='ae e3 sm:min-h-[150px] xss:min-h-[120px]'/>
            <img src="iphone_emojis/heart.png" alt="" className='ae e4 sm:min-h-[150px] xss:min-h-[120px]'/>
            <img src="iphone_emojis/eyes.png" alt="" className='ae e5 sm:min-h-[150px] xss:min-h-[120px]'/>
            <img src="iphone_emojis/blushing.png" alt="" className='ae e6 sm:min-h-[150px] xss:min-h-[120px]'/>
          </div>

          <main className='relative w-100 max-w-5xl mx-auto xss:mt-[25vh] xs:mt-[21vh] md:mt-[15vh] lg:mt-[7vh] sm:pt-24 lg:pt-32'>
            <div className='w-full'>
              <h1 className='px-1 text-white font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center whitespace-break-spaces'>Imagine a place where you can share Memes and have Fun.</h1>
              <p className='px-3 mt-4 text-lg text-center max-w-3xl mx-auto text-[#e4e4e4]'>Bantr is a vibrant community to make new friends and connect with like-minded people. We like to spread positivity and fun by humor and laughter.</p>
              <div className='lg:mt-7 xss:mt-8 flex justify-center space-x-6'>
                <Link to="/sign-in" className='bg-[#FAC304] btnn sm:px-6 sm:py-3 xs:px-[5vw] xs:py-[2vw] xss:px-[3.5vw] xss:py-[1.5vw] rounded-lg flex'><h1 className='text-black font-semibold xs:text-xl xss:text-lg whitespace-nowrap'>Get Started</h1><i className="ri-arrow-right-line text-black text-2xl font-bold ml-2 button-arrow"></i></Link>
                <Link to="/sign-in" className='bg-[#242424] btnn sm:px-6 sm:py-3 xs:px-[5vw] xs:py-[2vw] xss:px-[3.5vw] xss:py-[1.5vw] rounded-lg flex'><h1 className='text-white font-semibold xs:text-xl xss:text-lg whitespace-nowrap'>Start As Guest</h1><i className="ri-arrow-right-line text-white text-2xl font-bold ml-2 button-arrow"></i></Link>
              </div>
            </div>
          </main>

          <div className='mt-20 xss:mt-32 sm:mt-28 lg:mt-40 mb-36 lg:flex xss:block w-[100vw] z-500 justify-between lg:px-[8rem]'>
            <div className='flex justify-center lg:mx-auto xss:mb-10'>
              <img src="log.png" alt="" className='flex md:min-h-[140px] xss:min-h-[110px] h-[12vw] ' />
            </div>
            <div className='lg:w-[70%] flex justify-center xss:w-full'>
              <div>
                <h1 className='font-pop font-black lg:text-6xl whitespace-nowrap xs:text-[9vw] xss:text-[9vw] md:text-6xl xss:text-center xss:w-full lg:text-left'>WHAT IS BANTR?</h1>
                <p className='font-pop lg:font-normal xss:font-light lg:text-lg xss:text-sm leading-[1.7rem] md:mt-4 xss:mt-0 lg:w-[100%] lg:max-w-[39rem] text-gray-200 xss:text-center xss:w-[90%] xss:max-w-[700px] lg:text-left lg:whitespace-normal lg:mx-0 xss:mx-auto'>Bantr is a dynamic online community designed for teens to connect, share, and enjoy the lighter side of life. It's a place where humor thrives, friendships blossom, and creativity knows no bounds.</p>
                <div className='flex xss:justify-center lg:justify-start mt-2'>
                  <img src="star.png" alt="" className='h-8' />
                  <img src="star.png" alt="" className='h-8' />
                  <img src="star.png" alt="" className='h-8' />
                  <img src="star.png" alt="" className='h-8' />
                  <img src="star.png" alt="" className='h-8' />
                </div>
              </div>
            </div>
          </div>

          <div className='mb-28 w-[100vw]'>
            <h1 className='font-pop font-black lg:text-6xl xs:text-[9vw] xss:text-[9vw] md:text-6xl whitespace-nowrap text-center'>WHY BANTR?</h1>
            <div className='flex flex-wrap justify-between sm:px-[5.5rem] md:px-[6rem] lg:px-[8rem] mt-10'>
              <div className='w-full sm:w-1/2 lg:w-1/3 flex flex-col items-center justify-center p-4'>
                <img src="/why/lock.png" alt="" className='h-[7vw] min-h-[85px] max-h-[100px]' />
                <h1 className='font-pop font-semibold mb-1 mt-1 text-2xl whitespace-nowrap'>E2E Encryption</h1>
                <p className='w-[70%] min-w-[222px] text-center text-gray-200'>At Bantr, your privacy and security are our top priorities. your messages and shared content are always protected</p>
              </div>
              <div className='w-full sm:w-1/2 lg:w-1/3 flex flex-col items-center justify-center p-4'>
                <img src="/why/channel.png" alt="" className='h-[7vw] min-h-[85px] max-h-[100px]' />
                <h1 className='font-pop font-semibold mb-1 text-2xl whitespace-nowrap'>Organized Channels</h1>
                <p className='w-[70%] min-w-[222px] text-center text-gray-200'>We have channels for all topics. Easily find and join channels that match your interests. With like minded people.</p>
              </div>
              <div className='w-full sm:w-1/2 lg:w-1/3 flex flex-col items-center justify-center p-4'>
                <img src="/why/home.png" alt="" className='h-[7vw] min-h-[85px] max-h-[100px]' />
                <h1 className='font-pop font-semibold translate-y-2 mb-2 mt-1 text-2xl whitespace-nowrap'>Best Community</h1>
                <p className='w-[70%] min-w-[222px] text-center text-gray-200'>Meet like minded people at Bantr And Join a community of memers where friendships grow and every interaction is filled with smiles</p>
              </div>
            </div>
          </div>

          <div className='mb-28 flex flex-col'>
            <h1 className='font-pop font-black text-[6vw] xss:text-[9vw] sm:text-[5vw] md:text-[4.5vw] lg:text-[4vw] leading-[1.13] text-center'>
              <span className='sm:whitespace-nowrap xss:whitespace-normal'>WHAT ARE YOU WAITING FOR?</span>
              <br />
              <span className='bg-gradient-to-r from-[#EEC800] to-[#FF8A00] text-transparent bg-clip-text'>JOIN US NOW!</span>
            </h1>
            <Link to="/sign-in" className='bg-[#ffffff] hover:bg-[#dfdfdf] btnn mx-auto px-[4vw] xss:px-[5vw] sm:px-[3.5vw] py-[1.5vw] xss:py-[3vw] sm:py-[1.3vw] lg:py-[1vw] lg:px-[2vw] xss:mt-[3vw] lg:mt-[2vw] rounded-full flex items-center justify-center'>
              <h1 className='text-black font-semibold text-[3vw] xss:text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.6vw] flex items-center whitespace-nowrap'>
                Get Started
                <i className="ri-arrow-right-line text-black ml-[1vw] button-arrow"></i>
              </h1>
            </Link>
          </div>

          <div className='mb-10'>
            <h1 className='text-center  text-[16vw] tracking-wider font-pop leading-none opacity-25 bg-gradient-to-b from-[#FFFFFF] to-[#414141] text-transparent bg-clip-text'>Contact Us</h1>
            <div className='lg:px-[5rem] md:px-[5rem] sm:px-[3.5rem] xs:px-[3rem] xss:px-[2.4rem] sm:-translate-y-14 xss:-translate-y-6'>
              <div className='flex flex-col lg:flex-row justify-between'>
                <div className='flex flex-col sm:space-y-8 xss:space-y-5 lg:w-[45%] mb-10 lg:mb-0'>
                  <div>
                    <h1 className='leading-none font-pop font-bold lg:text-6xl md:text-6xl sm:text-5xl xss:text-5xl text-gray-100 whitespace-nowrap'>Reach Out <i className="ri-arrow-right-up-line bg-gradient-to-bl lg:text-7xl xss:text-5xl  md:text-6xl sm:text-5xl from-[#FFFFFF] to-[#414141] text-transparent bg-clip-text"></i></h1>
                    <p className='mt-3 text-[16px] md:text-[1.35rem] whitespace-normal lg:text-[1.17rem] w-full lg:w-[35vw] text-[#d2d2d2] leading-[1.2] opacity-90'>Have a question or need assistance? Whether you're seeking support, have an inquiry, or simply want to connect, feel free to reach out. I'm always here to help and will make every effort to respond to you. I look forward to connecting with you soon.</p>
                    <div className='mt-10 flex-col mb-5'>
                      <div className='flex items-center mb-4'>
                        <div className='flex w-[40px] h-[40px] lg:w-[45px] lg:h-[45px] bg-[#DEDEDE] mr-5 rounded-full justify-center items-center'>
                          <img src="check.png" alt="" className='w-[67%]' />
                        </div>
                        <h1 className='font-pop font-medium text-lg'>Timely Response</h1>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex w-[40px] h-[40px] lg:w-[45px] lg:h-[45px] bg-[#DEDEDE] mr-5 rounded-full justify-center items-center'>
                          <img src="check.png" alt="" className='w-[67%]' />
                        </div>
                        <h1 className='font-pop font-medium text-lg'>Personalized response</h1>
                      </div>
                    </div>
                  </div>
                  <div className='flex mb-5'>
                    <a className='flex glow md:w-[50px] md:h-[50px] sm:w-[45px] sm:h-[45px] xss:w-[45px] xss:h-[45px] bg-[#EBEBEB] hover:bg-white mr-5 rounded-full justify-center items-center blur-thing' target="_blank" href='https://github.com/SiddDevZ'>
                      <i className="ri-github-fill    text-black md:text-[40px] xss:text-[35px]"></i>
                    </a>
                    <a className='flex glow md:w-[50px] md:h-[50px] sm:w-[45px] sm:h-[45px] xss:w-[45px] xss:h-[45px] bg-[#EBEBEB] hover:bg-white mr-5 rounded-full justify-center items-center' target="_blank" href=''>
                      <i className="ri-twitter-x-line text-black md:text-[32px] xss:text-[30px]"></i>
                    </a>
                    <a className='flex glow md:w-[50px] md:h-[50px] sm:w-[45px] sm:h-[45px] xss:w-[45px] xss:h-[45px] bg-[#EBEBEB] hover:bg-white mr-5 rounded-full justify-center items-center' target="_blank" href='https://www.instagram.com/siddharth_jorwal/'>
                      <i className="ri-instagram-line text-black md:text-[38px] xss:text-[32px]"></i>
                    </a>
                  </div>
                </div>
            
                <div className='w-full lg:w-[45%] border border-[#c0c0c0] p-7 rounded-xl'>
                  <form className='xss:space-y-4 md:space-y-6' onSubmit={handleSubmit}>
                    <div className='flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3'>
                      <div className='w-full sm:w-1/3'>
                        <input type="text" id="name" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} className='h-12 block bg-[rgba(103,103,103,0.2)] pl-4 w-full border rounded-2xl shadow-sm text-gray-100' />
                      </div>
                      <div className='w-full sm:w-2/3'>
                        <input type="email" id="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className='h-12 block bg-[rgba(103,103,103,0.2)] pl-4 w-full border rounded-2xl shadow-sm text-gray-100' />
                      </div>
                    </div>
                    <div>
                      <textarea id="message" rows="4" placeholder='Message' value={message} onChange={(e) => setMessage(e.target.value)} className='mt-1 block w-full bg-[rgba(103,103,103,0.2)] pl-4 pt-2 h-72 border rounded-2xl shadow-sm text-gray-100'></textarea>
                    </div>
                    <div className='flex justify-center'>
                      <button className='flex-grow bg-red-500 glow bg-gradient-to-r from-[#FFFFFF] to-[#B7B7B7] font-pop text-xl h-12 rounded-full text-black' type="submit">Submit</button>
                    </div>
                  </form>
                </div>
              </div>
              <ToastContainer />
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  )
}

export default Landing

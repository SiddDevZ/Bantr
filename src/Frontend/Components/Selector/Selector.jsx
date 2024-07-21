import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'

const Selector = ({ servers, setCreateServerPopup }) => {

  const navigate = useNavigate();
  const { serverID } = useParams();
  const [selectedServer, setSelectedServer] = useState(null);
  const [hoveredServer, setHoveredServer] = useState(null);

  useEffect(() => {
    setSelectedServer(Number(serverID));
  }, [serverID]);

  const handleServerClick = (server) => {
    setSelectedServer(server._id);
    
    // Find the first public channel
    const firstPublicChannel = server.channels.find(channel => channel.type === "public");
    const firstServerChannel = server.channels.find(channel => channel.type === "server");
    
    if (firstPublicChannel) {
      navigate(`/chat/${server._id}/${firstPublicChannel.channelId}`);
    } else {
      console.log("error finding a public channel")
      navigate(`/chat/${server._id}/${firstServerChannel.channelId}`);
    }
  }

  const handleInboxClick = () => {
    setSelectedServer("inbox");
    navigate("/chat/@inbox");
  }

  
  return (
    <div className='w-full min-h-[4.75rem] z-10 flex relative items-center overflow-x-auto  unselectable px-3 bg-[#2A2821] space-x-2'>
        <div 
        key="inbox" 
        onClick={() => handleInboxClick()} 
        onMouseEnter={() => setHoveredServer("inbox")}
        onMouseLeave={() => setHoveredServer(null)}
        className="flex flex-col items-center"
        >
            <div className={`h-[3.6rem] w-[3.6rem] flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out mb-1`} style={{borderRadius: hoveredServer === "inbox" || selectedServer === "inbox" ? '1.15rem' : '50%', backgroundColor: selectedServer === "inbox" ? '#3F310E' : '#383631',}}>
              <img src='/chat.png' alt="" className='w-[65%]' />
            </div>
            
            {/* <div className="absolute bottom-1 h-1 bg-white rounded-full transition-all duration-300 ease-in-out"style={{width: selectedServer === server.serverID ? '2rem' : hoveredServer === server.serverID ? '0.7rem' : '0rem',}}></div> */}
        </div>
        <div className='w-[0.6rem] flex justify-center'><div className='h-7 w-[1px] bg-[#B7B7B7]'></div></div>
      {servers.map((server => (
        <div 
        key={server._id} 
        onClick={() => handleServerClick(server)} 
        onMouseEnter={() => setHoveredServer(server._id)}
        onMouseLeave={() => setHoveredServer(null)}
        className="flex flex-col items-center"
        >
            <div className={`h-[3.6rem] w-[3.6rem] flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out mb-1`} style={{backgroundColor: server.color, borderRadius: hoveredServer === server._id || selectedServer === server._id ? '1.15rem' : '50%',}}>
              <img src='/log.png' alt="" className='w-[77%]' />
            </div>
            <div className="absolute bottom-1 h-1 bg-white rounded-full transition-all duration-300 ease-in-out"style={{width: selectedServer === server._id ? '2rem' : hoveredServer === server._id ? '0.7rem' : '0rem',}}></div>
        </div>
      )))}
      <div 
        key="add" 
        onClick={() => setCreateServerPopup(true)} 
        onMouseEnter={() => setHoveredServer("add")}
        onMouseLeave={() => setHoveredServer(null)}
        className="flex flex-col items-center"
        >
            <div className={`h-[3.6rem] w-[3.6rem] flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out mb-1`} style={{borderRadius: hoveredServer === "add" || selectedServer === "add" ? '1.15rem' : '50%', backgroundColor: selectedServer === "add" ? '#3F310E' : '#383631',}}>
              <img src='/add.png' alt="" className='w-[75%]' />
            </div>
            
            {/* <div className="absolute bottom-1 h-1 bg-white rounded-full transition-all duration-300 ease-in-out"style={{width: selectedServer === server.serverID ? '2rem' : hoveredServer === server.serverID ? '0.7rem' : '0rem',}}></div> */}
        </div>
        <div 
        key="discover" 
        onClick={() => handleInboxClick()} 
        onMouseEnter={() => setHoveredServer("discover")}
        onMouseLeave={() => setHoveredServer(null)}
        className="flex flex-col items-center"
        >
            <div className={`h-[3.6rem] w-[3.6rem] flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out mb-1`} style={{borderRadius: hoveredServer === "discover" || selectedServer === "discover" ? '1.15rem' : '50%', backgroundColor: selectedServer === "discover" ? '#3F310E' : '#383631',}}>
              <img src='/discover.png' alt="" className='w-[65%]' />
            </div>
            
            {/* <div className="absolute bottom-1 h-1 bg-white rounded-full transition-all duration-300 ease-in-out"style={{width: selectedServer === server.serverID ? '2rem' : hoveredServer === server.serverID ? '0.7rem' : '0rem',}}></div> */}
        </div>
    </div>
  )
}

export default Selector

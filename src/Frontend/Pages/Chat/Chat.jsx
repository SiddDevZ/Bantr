import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Chat.css";
import Cookies from "js-cookie";
import Selector from "../../Components/Selector/Selector";

const EditableChannelName = ({ onSave, onCancel }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleKeys = (e) => {
    if (e.key === "Enter") {
      onSave(e.target.value);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="flex gap-2 px-2 items-center rounded-md bg-[#46453e]">
      <i className="ri-hashtag text-2xl font-light text-[#807D73]"></i>
      <input
        ref={inputRef}
        className="bg-transparent text-[#e4e4e4] text-base font-inter font-medium outline-none"
        placeholder="Enter channel name"
        onKeyDown={handleKeys}
        onBlur={() => onCancel()}
      />
    </div>
  );
};

const Chat = () => {

  const { serverId, channelId } = useParams();
  const navigate = useNavigate();
  const [servers, setServers] = useState([]);
  const [serverChannels, setServerChannels] = useState([]);
  const [publicChannels, setPublicChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshServers, setRefreshServers] = useState(false);
  const [creatingServerChannel, setCreatingServerChannel] = useState(false);
  const [creatingPublicChannel, setCreatingPublicChannel] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [userData, setUserData] = useState([])
  const [createServerPopup, setCreateServerPopup] = useState(false);
  const [newServerName, setNewServerName] = useState(`${userData.username}'s Server`)
  const [isClosing, setIsClosing] = useState(false);

  const serverNameRef = useRef(null);

  // if (!serverId || !channelId) {
  // return <Navigate to="/chat/@me" />;
  // }

  const headers = {
    "Content-Type": "application/json",
    // "Authorization": `Bearer ${token}`
  };

  useEffect(() => {
    const fetchData = async () => {
      if (initialLoad || refreshServers) {
        try {
          const token = Cookies.get("token");
          if (!token) {
            navigate("/login");
            throw new Error("No authentication token found");
          }
  
          // Fetch user data first
          const userResponse = await fetch("http://localhost:3000/api/fetchuser", {
            method: "POST",
            headers,
            body: JSON.stringify({ token })
          });
  
          if (!userResponse.ok) {
            throw new Error("Failed to fetch user data");
          }
  
          const userData = await userResponse.json();
          setUserData(userData);
          setNewServerName(`${userData.username}'s Server`);
  
          // Now fetch servers using the user's joinedServers
          const serversResponse = await fetch("http://localhost:3000/api/fetchservers", {
            method: "POST",
            headers,
            body: JSON.stringify({ token, userServers: userData.joinedServers })
          });
  
          if (!serversResponse.ok) {
            throw new Error("Failed to fetch server data");
          }
  
          const serversData = await serversResponse.json();
          setServers(serversData);
  
          console.log(userData);
          console.log(serversData);
        } catch (error) {
          console.error("Error fetching data: ", error);
          console.log(error.message);
        } finally {
          setInitialLoad(false);
          setRefreshServers(false);
          setLoading(false);
        }
      }
    };
  
    fetchData();
  }, [refreshServers]);
  
  useEffect(() => {
    if (!userData) {
      navigate("/login")
    }
  }, [userData]);

  useEffect(() => {
    if (createServerPopup) {
      serverNameRef.current.focus();
    }
  }, [createServerPopup]);

  useEffect(() => {
    if (servers.length > 0 && serverId) {
      const currentServer = servers.find((server) => server._id === serverId);

      if (currentServer) {
        const serverChans = [];
        const publicChans = [];

        currentServer.channels.forEach((channel) => {
          const channelData = {
            channelID: channel.channelId,
            channelName: channel.channelName,
          };

          if (channel.type === "server") {
            serverChans.push(channelData);
          } else if (channel.type === "public") {
            publicChans.push(channelData);
          }
        });
        setServerChannels(serverChans);
        setPublicChannels(publicChans);
      }
    }
  }, [servers, serverId]);

  const createNewChannel = async (serverId, newChannelName, channelType) => {
    if (newChannelName !== "") {
      console.log(serverId, newChannelName, channelType);
      const response = await fetch("http://localhost:3000/api/makechannel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serverId, newChannelName, channelType }),
      });
      if (response.status === 201) {
        setRefreshServers(!refreshServers);
      } else {
        const result = await response.json();
        console.error("Error creating channel: ", result);
      }
    }
  };

  const handleChannelClick = (channelId) => {
    // console.log(channelId)
    navigate(`/chat/${serverId}/${channelId}`);
  };

  if (loading) {
    return (
      <div className="h-[100vh] w-[100vw] bg-[#383631] flex items-center justify-center text-white">
        <h1 className="text-6xl font-pop font-bold opacity-50">Loading...</h1>
      </div>
    );
  }

  console.log(serverId, channelId);
  const currentServer = servers.find((server) => server._id === serverId);
  const isOwner = currentServer.owner === userData._id

  if (!channelId) {
    console.log("no channel id");
    const firstPublicChannel = currentServer.channels.find(
      (channel) => channel.type === "public"
    );
    const firstServerChannel = currentServer.channels.find(
      (channel) => channel.type === "server"
    );

    if (firstPublicChannel) {
      navigate(`/chat/${currentServer._id}/${firstPublicChannel.channelId}`);
    } else {
      console.log("error finding a public channel");
      navigate(`/chat/${currentServer._id}/${firstServerChannel.channelId}`);
    }
  }
  const currentChannel = currentServer.channels.find(
    (channel) => channel.channelId === channelId
  );

  const makeServer = async (name, id) => {
    const response = await fetch("http://localhost:3000/api/makeserver", {
        method: "POST",
        headers,
        body: JSON.stringify({ name: name, token: Cookies.get("token"), owner: id })
      }
    );

    return response; 
  }

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setCreateServerPopup(false);
      setIsClosing(false);
    }, 200); // Adjust time to match animation duration
  };

  const handleCreateServerSubmit = async (e) => {
    e.preventDefault()
    handleCancel()

    const response = await makeServer(newServerName.substring(0, 18), userData._id)
    if (response.ok) {
      console.log("server created");
      setRefreshServers(!refreshServers)
    } else { setRefreshServers(!refreshServers) }
  }
  


  return (
    <>
      <main className="bg-[#383631] flex flex-col relative h-screen text-white">
        <Selector servers={servers} setCreateServerPopup={setCreateServerPopup} />

        <div className="flex flex-1">
          <div className="w-[16.7rem] flex justify-between flex-col bg-[#31302B]">
            <div className="overflow-y-auto">
              <div className="h-[5.2rem] flex border-b border-[#828282] items-center justify-center gap-9 unselectable">
                <div>
                  <h1 className="font-inter font-bold text-xl whitespace-nowrap">
                    {currentServer ? currentServer.serverName : "Server"}
                  </h1>
                  <div className="mt-1 flex text-xs space-x-3">
                    <div className="flex items-center space-x-0.5">
                      <div className="rounded-full bg-[#CCCCCC] h-2 w-2"></div>
                      <span className="text-xs">10 Members</span>
                    </div>

                    <div className="flex items-center space-x-0.5">
                      <div className="rounded-full bg-green-600 h-2 w-2"></div>
                      <span className="text-xs">10 Online</span>
                    </div>
                  </div>
                </div>

                <div className="">
                  <img src="/leave.png" alt="" />
                </div>
              </div>

              <div className="flex-grow overflow-y-auto">
                <div className="flex flex-col">
                  <div className="flex items-center ml-3 mt-2 justify-between mr-4 parent">
                    <div className="flex items-center gap-0.5">
                      <i className="ri-arrow-down-s-line text-[#C1C1C1]"></i>
                      <h3 className="font-semibold font-inter text-xs text-[#C1C1C1] unselectable">
                        SERVER
                      </h3>
                    </div>

                    <div
                      className="child cursor-pointer"
                      title="Create Channel"
                      onClick={() => setCreatingServerChannel(true)}
                    >
                      <i className="ri-add-line text-[#C1C1C1] text-lg"></i>
                    </div>
                  </div>
                  <div className="flex flex-col ml-3 mr-2 mt-1 gap-1">
                    {serverChannels.map((channel) => (
                      <div
                        key={channel.channelID}
                        onClick={() => handleChannelClick(channel.channelID)}
                        className="flex px-2 items-center justify-between rounded-md hover:bg-[#46453e] transition-all duration-[50ms] unselectable cursor-pointer group"
                      >
                        <div className="flex gap-2 items-center">
                          <i className="ri-hashtag text-2xl font-light text-[#807D73]"></i>
                          <h1 className="text-[#e4e4e4] text-base font-inter font-medium">
                            {channel.channelName}
                          </h1>
                        </div>
                        {isOwner && (
                          <div className="hidden group-hover:block" title={`Delete "${channel.channelName}"`}>
                            <i className="ri-delete-bin-6-line text-[#da3030] opacity-65 hover:opacity-100"></i>
                          </div>
                        )}
                      </div>
                    ))}
                    {creatingServerChannel && (
                      <EditableChannelName
                        onSave={(name) => {
                          createNewChannel(currentServer._id, name.substring(0, 24), "server");
                          setCreatingServerChannel(false);
                        }}
                        onCancel={() => setCreatingServerChannel(false)}
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center ml-3 mt-2 justify-between mr-4 parent">
                    <div className="flex items-center gap-0.5">
                      <i className="ri-arrow-down-s-line text-[#C1C1C1]"></i>
                      <h3 className="font-semibold font-inter text-xs text-[#C1C1C1] unselectable">
                        PUBLIC
                      </h3>
                    </div>
                    <div
                      className="child cursor-pointer"
                      title="Create Channel"
                      onClick={() => setCreatingPublicChannel(true)}
                    >
                      <i className="ri-add-line text-[#C1C1C1] text-lg"></i>
                    </div>
                  </div>
                  <div className="flex flex-col ml-3 mr-2 mt-1 gap-1">
                    {publicChannels.map((channel) => (
                      <div
                        key={channel.channelID}
                        onClick={() => handleChannelClick(channel.channelID)}
                        className="flex gap-2 px-2 items-center justify-between rounded-md hover:bg-[#46453e] transition-all duration-[50ms] unselectable cursor-pointer group"
                      >
                        <div className="flex gap-2 items-center">
                          <i className="ri-hashtag text-2xl font-light text-[#807D73]"></i>
                          <h1 className="text-[#e4e4e4] text-base font-inter font-medium">
                            {channel.channelName}
                          </h1>
                        </div>
                        {isOwner && (
                          <div className="hidden group-hover:block" title={`Delete "${channel.channelName}"`}>
                            <i className="ri-delete-bin-6-line text-[#da3030] opacity-65 hover:opacity-100"></i>
                          </div>
                        )}
                      </div>
                    ))}
                    {creatingPublicChannel && (
                      <EditableChannelName
                        onSave={(name) => {
                          createNewChannel(currentServer._id, name.substring(0, 24), "public");
                          setCreatingPublicChannel(false);
                        }}
                        onCancel={() => setCreatingPublicChannel(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[3.75rem] bg-[#191814]">
              <div className="flex h-full items-center px-4">
                <div className="relative rounded-full flex items-center justify-center bg-[#D80000] h-11 w-11 i unselectable">

                  {userData.avatar ? (
                    <img src={`${userData.avatar}`} alt="" className="rounded-full" />
                  ) : (
                    <img src="/log.png" alt="" className="w-[80%]" />
                  )}

                  <div className="absolute bottom-0 right-0 w-[0.68rem] h-[0.68rem] bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-4 unselectable">
                  <h1 className="text-white whitespace-nowrap font-inter font-bold">{userData.username}</h1>
                  <h2 className="font-inter text-sm font-bold text-[#858585]" style={{lineHeight: 0.85}}>Online</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 ">
            <div className="h-12 flex items-center bg-[#383631] border-b border-[#2c2a27]">
              <div className="flex items-center gap-2 ml-7 unselectable">
                <i className="ri-hashtag text-3xl font-light text-[#807D73]"></i>
                <h1 className="text-[#e4e0dd] text-xl font-inter font-semibold">
                  {currentChannel.channelName}
                </h1>
              </div>
            </div>
          </div>
          <div className="w-48 bg-[#31302B] overflow-y-auto">
            <div className="h-12 flex bg-[#31302B] items-center justify-center border-b border-[#2c2a27]">
              <button className="bg-[#1b5e25] flex items-center px-3 gap-2 py-[0.35rem] rounded-md hover:bg-[#197326] transition-all shadow-sm">
                <h1 className="text-base font-inter font-medium text-white">Invite People</h1>
                <i class="ri-user-add-line"></i>
              </button>
            </div>
          </div>
        </div>
        {createServerPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className={`bg-[#31302B] p-6 w-[30rem] rounded-lg shadow-xl ${isClosing ? 'fade-out' : 'fade-in'}`}>
              <h2 className="text-2xl text-[#f7f7f5] text-center font-bold mb-1">Create New Server</h2>
              <p className="font-inter mb-6 text-center font-thin px-6 text-base text-[#979ba2]">Give your new server a personality with a name. You cannot change it later.</p>
              <form>
                <label className="block text-gray-300 text-xs mb-1 font-bold" htmlFor="username">SERVER NAME</label>
                <input
                  type="text"
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  placeholder="Enter server name"
                  className="h-11 w-full flex items-center pl-6 text-xl rounded bg-[#22211e] text-white focus:outline-none focus:ring-0"
                  ref={serverNameRef}
                  onBlur={() => handleCancel()}
                />

                <div className="flex justify-between pt-7">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="mr-2 px-3 py-2 text-white rounded hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateServerSubmit}
                    className="px-8 py-2 bg-[#e0b038] rounded hover:bg-[#e1ac24] transition-all"
                  >
                    <h1 className="font-semibold text-black">Create</h1>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Chat;

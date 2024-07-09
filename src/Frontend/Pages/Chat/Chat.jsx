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

  // if (!serverId || !channelId) {
  // return <Navigate to="/chat/@me" />;
  // }

  useEffect(() => {
    const fetchData = async () => {
      if (initialLoad || refreshServers) {
        // setLoading(true);
        try {
          const token = Cookies.get("token");
          if (!token) {
            throw new Error("No authentication token found");
          }
  
          const headers = {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`
          };
  
          const [serversResponse, userResponse] = await Promise.all([
            fetch("http://localhost:3000/api/fetchservers", {
              method: "POST",
              headers,
              body: JSON.stringify({ token })
            }),
            fetch("http://localhost:3000/api/fetchuser", {
              method: "POST",
              headers,
              body: JSON.stringify({ token })
            })
          ]);
  
          if (!serversResponse.ok || !userResponse.ok) {
            throw new Error("Failed to fetch data");
          }
  
          const [serversData, userData] = await Promise.all([
            serversResponse.json(),
            userResponse.json()
          ]);
  
          setServers(serversData);
          setUserData(userData);
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

  return (
    <>
      <main className="bg-[#383631] flex flex-col h-screen text-white">
        <Selector servers={servers} />

        <div className="flex flex-1">
          <div className="w-[16.7rem] flex flex-col justify-between bg-[#31302B] overflow-y-auto">
            <div>
              <div className="h-[5.2rem] flex border-b border-[#828282] items-center justify-center gap-9">
                <div>
                  <h1 className="font-inter font-bold text-xl">
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

              <div>
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
                        className="flex gap-2 px-2 items-center rounded-md hover:bg-[#46453e] transition-all duration-[50ms] unselectable cursor-pointer"
                      >
                        <i className="ri-hashtag text-2xl font-light text-[#807D73]"></i>
                        <h1 className="text-[#e4e4e4] text-base font-inter font-medium">
                          {channel.channelName}
                        </h1>
                      </div>
                    ))}
                    {creatingServerChannel && (
                      <EditableChannelName
                        onSave={(name) => {
                          createNewChannel(currentServer._id, name, "server");
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
                        className="flex gap-2 px-2 items-center rounded-md hover:bg-[#46453e] transition-all duration-[50ms] unselectable cursor-pointer"
                      >
                        <i className="ri-hashtag text-2xl font-light text-[#807D73]"></i>
                        <h1 className="text-[#e4e4e4] text-base font-inter font-medium">
                          {channel.channelName}
                        </h1>
                      </div>
                    ))}
                    {creatingPublicChannel && (
                      <EditableChannelName
                        onSave={(name) => {
                          createNewChannel(currentServer._id, name, "public");
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
                <div className="rounded-full bg-[#D80000] h-11 w-11 i">
                  <img src="/log.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 ">
            <div className="h-12 flex items-center bg-[#383631] border-b border-[#2c2a27]">
              <div className="flex items-center gap-2 ml-7">
                <i className="ri-hashtag text-3xl font-light text-[#807D73]"></i>
                <h1 className="text-[#e4e0dd] text-xl font-inter font-semibold">
                  {currentChannel.channelName}
                </h1>
              </div>
            </div>
          </div>
          <div className="w-48 bg-[#31302B] overflow-y-auto"></div>
        </div>
      </main>
    </>
  );
};

export default Chat;

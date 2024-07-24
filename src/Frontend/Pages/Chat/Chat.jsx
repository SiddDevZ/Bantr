import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Chat.css";
import Cookies from "js-cookie";
import TextBar from '../../Components/TextBar/TextBar'
import Message from '../../Components/Message/Message'
import Selector from "../../Components/Selector/Selector";
import io from 'socket.io-client';
import config from '../../../../config.json'

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
  const params = useParams();
  const [serverId, setServerId] = useState(params.serverId);
  const [channelId, setChannelId] = useState(params.channelId);
  useEffect(() => {
    setServerId(params.serverId);
    setChannelId(params.channelId);
  }, [params.serverId, params.channelId]);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [servers, setServers] = useState([]);
  const [serverChannels, setServerChannels] = useState([]);
  const [publicChannels, setPublicChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshServers, setRefreshServers] = useState(false);
  const [creatingServerChannel, setCreatingServerChannel] = useState(false);
  const [creatingPublicChannel, setCreatingPublicChannel] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [userData, setUserData] = useState([]);
  const [createServerPopup, setCreateServerPopup] = useState(false);
  const [newServerName, setNewServerName] = useState(`${userData.username}'s Server`);
  const [isClosing, setIsClosing] = useState(false);
  const [members, setMembers] = useState([]);
  const [ownerData, setOwnerData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageUserData, setMessageUserData] = useState([]);
  const [currentServer, setCurrentServer] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const serverNameRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);

  // if (!serverId || !channelId) {
  // return <Navigate to="/chat/@me" />;
  // }

  const headers = {
    "Content-Type": "application/json",
    // "Authorization": `Bearer ${token}`
  };

  const getOnlineUsers = async () => {
    try {
      const onlineUsersResponse = await fetch(
        `${config.url}/getonlineusers`,
        {
          method: "POST",
          headers,
        }
      );

      if (!onlineUsersResponse.ok) {
        throw new Error("Failed to Get online users");
      }
      const onlineUserData = await onlineUsersResponse.json()
      setOnlineUsers(onlineUserData)
      // console.log(onlineUserData)

    } catch (err) {
      console.log(`Error getting Online users: ${err}`)
    }
  }

  const exitServer = async () => {
    try {
      const exitServerResponse = await fetch(
        `${config.url}/exitserver`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            _id: userData._id,
            serverId: currentServer._id
          }),
        }
      )
      if (!exitServerResponse.ok) {
        throw new Error("Failed to exit");
      } else{
        const updatedServers = servers.filter(server => server._id !== currentServer._id)
        setServers(updatedServers)
        navigate(`/chat/${updatedServers[updatedServers.length - 1]["_id"]}`)
      }
    } catch (err) {
      console.log(`Error Exiting Server: ${err}`)
    }
  }

  const getMessages = async (currentChannel) => {
    try {
      const messagesResponse = await fetch(
        `${config.url}/getmessages`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            channelId: currentChannel.channelId
          }),
        }
      );
      if (!messagesResponse.ok) {
        throw new Error("Failed to fetch messages");
      }
      const messagesData = await messagesResponse.json();

      const messagesUserResponse = await fetch(
        `${config.url}/getmsgusers`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            messages: messagesData
          }),
        }
      );
      if (!messagesUserResponse.ok) {
        throw new Error("Failed to fetch userData of messages");
      }
      const messageUserData = await messagesUserResponse.json();
      await getOnlineUsers();
      setMessageUserData(messageUserData);
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  useEffect(() => {
    const newSocket = io(config.normal);
    setSocket(newSocket);
    newSocket.emit('user connected', userData._id);
    
    newSocket.on('user status changed', ({ userId, status }) => {
      getOnlineUsers();
    });
  
    return () => {
      newSocket.close();
    };
  }, [userData]);

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      if (true) {
        try {
          const token = Cookies.get("token");

          if (!token) {
            navigate("/login");
            throw new Error("No authentication token found");
          }

          // Fetch user data first
          const userResponse = await fetch(
            `${config.url}/fetchuser`,
            {
              method: "POST",
              headers,
              body: JSON.stringify({ token }),
            }
          );

          if (!userResponse.ok) {
            throw new Error("Failed to fetch user data");
          }

          const userData = await userResponse.json();
          // console.log(userData);
          setUserData(userData);
          setNewServerName(`${userData.username}'s Server`);
          // console.log(userData.joinedServers);

          const serversResponse = await fetch(
            `${config.url}/fetchservers`,
            {
              method: "POST",
              headers,
              body: JSON.stringify({
                token,
                userServers: userData.joinedServers,
              }),
            }
          );
          if (!serversResponse.ok) {
            throw new Error("Failed to fetch server data");
          }
          const serversData = await serversResponse.json();
          setServers(serversData);
  
          const currServer = serversData.find((server) => server._id === serverId);
          setCurrentServer(currServer);

          let currChannel = null;

          if (!channelId) {
            console.log("no channel id");
            const firstPublicChannel = currServer.channels.find(
              (channel) => channel.type === "public"
            );
            const firstServerChannel = currServer.channels.find(
              (channel) => channel.type === "server"
            );

        
            if (firstPublicChannel) {
              navigate(`/chat/${currServer._id}/${firstPublicChannel.channelId}`);
              currChannel = currServer.channels.find(
                (channel) => channel.channelId === firstPublicChannel.channelId
              );
              console.log(currChannel)
            } else {
              console.log("error finding a public channel");
              navigate(`/chat/${currServer._id}/${firstServerChannel.channelId}`);
              currChannel = currServer.channels.find(
                (channel) => channel.channelId === firstServerChannel.channelId
              );
            }
          } else{
            currChannel = currServer.channels.find(
              (channel) => channel.channelId === channelId
            );
          }

          if (currServer) {
            // console.log("currChannel: ", currChannel);
            if (currChannel) {
              console.log("Channel Name: ", currChannel.channelName);
              setCurrentChannel(currChannel);
  
              // Fetch messages only if the channel has changed
              if (currChannel.channelId !== currentChannel?.channelId || initialLoad === true) {
                await getMessages(currChannel);
              }
            }
          }
  
          setIsOwner(currServer.owner === userData._id);
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally {
          setInitialLoad(false);
          setRefreshServers(false);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [refreshServers, channelId, serverId]);

  useEffect(() => {
    if (socket == null || currentChannel == null) return;
    // console.log("emitting join channel")
    // console.log(socket);

    socket.emit('join channel', currentChannel.channelId);

    socket.on('new message', () => {
      console.log("new message received");
      getMessages(currentChannel);
    });

    return () => {
      socket.off('new message');
    };
  }, [socket, currentChannel]);

  useEffect(() => {
    if (!userData) {
      navigate("/login");
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

  useEffect(() => {
    if (!servers || servers.length === 0) return;

    const currentServer = servers.find((server) => server._id === params.serverId);
    const currentmembers = [currentServer.owner, ...currentServer.members];
    if (!currentServer) return;

    const fetchMembers = async () => {
      try {
        const response = await fetch(`${config.url}/getmembers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ currentMembers: currentmembers })
        });
        const data = await response.json();
        // console.log(data)
        const ownerData = data.find(item => item._id === currentServer.owner);
        const membersData = data.filter(item => item._id !== currentServer.owner);
        setOwnerData(ownerData);
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, [servers, serverId]);

  const createNewChannel = async (serverId, newChannelName, channelType) => {
    if (newChannelName !== "") {
      console.log(serverId, newChannelName, channelType);
      const response = await fetch(`${config.url}/makechannel`, {
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
        <h1 className="text-6xl font-pop font-bold opacity-50">{currentChannel ? "No Channel/Server Found" : "Loading..."}</h1>
      </div>
    );
  }

  // console.log(serverId, channelId);
  // console.log(servers);

  const makeServer = async (name, id) => {
    const response = await fetch(`${config.url}/makeserver`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: name,
        token: Cookies.get("token"),
        owner: id,
      }),
    });

    return response;
  };

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setCreateServerPopup(false);
      setIsClosing(false);
    }, 200); // Adjust time to match animation duration
  };

  const refreshMessages = async () => {
    await getMessages(currentChannel);
  }

  const handleCreateServerSubmit = async (e) => {
    e.preventDefault();
    handleCancel();

    const response = await makeServer(
      newServerName.substring(0, 18),
      userData._id
    );
    if (response.ok) {
      console.log("server created");
      setRefreshServers(!refreshServers);
    } else {
      setRefreshServers(!refreshServers);
    }
  };

  // console.log("messages: ", messages);

  return (
    <>
      <main className="bg-[#383631] flex flex-col h-screen text-white overflow-hidden">
        <Selector
          servers={servers}
          setCreateServerPopup={setCreateServerPopup}
        />

        <div className="flex flex-1">
          <div className="w-[20rem] flex justify-between flex-col bg-[#31302B]">
            <div className="">
              <div className="h-[5.2rem] flex border-b border-[#828282] items-center justify-center gap-9 unselectable">
                <div>
                  <h1 className="font-inter font-bold text-xl whitespace-nowrap">
                    {currentServer ? currentServer.serverName : "Server"}
                  </h1>
                  <div className="mt-1 flex text-xs space-x-3">
                    <div className="flex items-center space-x-1">
                      <div className="rounded-full bg-[#CCCCCC] h-2 w-2"></div>
                      <span className="text-xs">{members.length+1} Members</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <div className="rounded-full bg-green-600 h-2 w-2"></div>
                      <span className="text-xs">{onlineUsers.length-1} Online</span>
                    </div>
                  </div>
                </div>

                <div className="cursor-pointer" title="Exit Server" onClick={() => exitServer()}>
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
                            {channel.channelName || "Make a channel"}
                          </h1>
                        </div>
                        {isOwner && (
                          <div
                            className="hidden group-hover:block"
                            title={`Delete "${channel.channelName}"`}
                          >
                            <i className="ri-delete-bin-6-line text-[#da3030] opacity-65 hover:opacity-100"></i>
                          </div>
                        )}
                      </div>
                    ))}
                    {creatingServerChannel && (
                      <EditableChannelName
                        onSave={(name) => {
                          createNewChannel(
                            currentServer._id,
                            name.substring(0, 24),
                            "server"
                          );
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
                          <div
                            className="hidden group-hover:block"
                            title={`Delete "${channel.channelName}"`}
                          >
                            <i className="ri-delete-bin-6-line text-[#da3030] opacity-65 hover:opacity-100"></i>
                          </div>
                        )}
                      </div>
                    ))}
                    {creatingPublicChannel && (
                      <EditableChannelName
                        onSave={(name) => {
                          createNewChannel(
                            currentServer._id,
                            name.substring(0, 24),
                            "public"
                          );
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
                    <img
                      src={`${userData.avatar}`}
                      alt=""
                      className="rounded-full"
                    />
                  ) : (
                    <img src="/log.png" alt="" className="w-[80%]" />
                  )}

                  <div className="absolute bottom-0 right-0 w-[0.68rem] h-[0.68rem] bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-4 unselectable">
                  <h1 className="text-white whitespace-nowrap font-inter font-bold">
                    {userData.username}
                  </h1>
                  <h2
                    className="font-inter text-sm font-bold text-[#858585]"
                    style={{ lineHeight: 0.85 }}
                  >
                    Online
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-between" style={{}}>
            <div className="flex flex-col w-full">
              <div className="h-12 flex items-center bg-[#383631] border-b border-[#2c2a27]">
                <div className="flex items-center gap-2 ml-7 unselectable">
                  <i className="ri-hashtag text-3xl font-light text-[#807D73]"></i>
                  <h1 className="text-[#e4e0dd] text-xl font-inter font-semibold">
                    {currentChannel.channelName}
                  </h1>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="pb-6 pt-2 w-full overflow-y-auto " style={{height: 'calc(100vh - 11.48rem)'}}>
                  {messages.map((message, index) => {
                    const previousMessage = index > 0 ? messages[index - 1] : null;
                    const isFirstMessageFromUser = !previousMessage || previousMessage.userId !== message.userId;
                    const msgusrData = messageUserData.find(user => user.userId === message.userId);

                    return (
                      <Message
                        key={message._id}
                        message={message}
                        userData={userData}
                        msgusrData={msgusrData}
                        isFirstMessageFromUser={isFirstMessageFromUser}
                      />
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <div className="h-[3.75rem]">
                  <TextBar channel={currentChannel.channelName} userData={userData} channelData={currentChannel} refreshMessages={refreshMessages} />
                </div>
              </div>
            </div>
            <div className="w-72 bg-[#31302B] overflow-y-auto">
              <div className="h-12 flex bg-[#31302B] items-center justify-center border-b border-[#2c2a27]">
                <button className="bg-[#1b5e25] flex items-center px-3 gap-2 py-[0.35rem] rounded-md hover:bg-[#197326] transition-all shadow-sm">
                  <h1 className="text-base font-inter font-medium text-white">
                    Invite People
                  </h1>
                  <i className="ri-user-add-line"></i>
                </button>
              </div>
              <div className="bg-gradient-to-r flex items-center justify-between from-[#FF3333]/15 to-[#46412A]/15 h-[2.15rem] rounded-lg mx-2 my-2">
                <div className="flex h-full ml-[0.60rem] items-center">
                  <div className="w-[1.74rem] h-[1.35rem] bg-gradient-to-r from-[#e43fadc1] to-[#3582cbe1] rounded-md flex items-center justify-center">
                    <img src="/crown.png" alt="" className="w-[75%]" />
                  </div>
                  <h1 className="font-pop font-medium text-sm text-[#BBBAB6] text-nowrap ml-[0.62rem] opacity-95">
                    Server Owner
                  </h1>
                </div>
                <h1 className="mr-[0.8rem] font-pop font-medium text-sm text-[#BBBAB6] text-nowrap opacity-95">
                  1
                </h1>
              </div>
              {/* {console.log(ownerData)} */}
              <div className="flex flex-col">
                <div className="h-[2.8rem] px-3 flex items-center rounded-md hover:bg-[#4e4c44] mx-1 transition-all duration-100 cursor-pointer">
                  <div className={`relative rounded-full flex items-center justify-center bg-[${ownerData.color}] h-[2.14rem] w-[2.14rem] i unselectable`}>
                    {ownerData.avatar ? (
                      <img
                        src={`${ownerData.avatar}`}
                        alt=""
                        className="rounded-full"
                      />
                    ) : (
                      <img src="/log.png" alt="" className="w-[80%]" />
                    )}
                    <div className={`absolute bottom-0 right-0 w-[0.55rem] h-[0.55rem] ${onlineUsers.find(user => ownerData._id === user) ? "bg-[#23a55a]" : "bg-[#d63030]"} rounded-full`}></div>
                  </div>
                  <h1 className="font-inter font-semibold text-base text-[#D8D8D8] ml-[0.8rem] whitespace-nowrap">
                    {ownerData.username}
                  </h1>
                </div>
              </div>
              <div className="bg-gradient-to-r flex items-center justify-between from-[#FF3333]/15 to-[#46412A]/15 h-[2.15rem] rounded-lg mx-2 my-2">
                <div className="flex h-full ml-[0.60rem] items-center">
                  <div className="w-[1.74rem] h-[1.35rem] bg-gradient-to-r from-[#e43fadc1] to-[#3582cbe1] rounded-md flex items-center justify-center">
                    <img src="/user.png" alt="" className="w-[75%]" />
                  </div>
                  <h1 className="font-pop font-medium text-sm text-[#BBBAB6] text-nowrap ml-[0.62rem] opacity-95">
                    Members
                  </h1>
                </div>
                <h1 className="mr-[0.8rem] font-pop font-medium text-sm text-[#BBBAB6] text-nowrap opacity-95">
                  {members.length}
                </h1>
              </div>
              <div className="flex flex-col">
                {members.map((member) => (
                  <div key={member._id} className="h-[2.8rem] px-3 flex items-center rounded-md hover:bg-[#4e4c44] mx-1 transition-all duration-100 cursor-pointer mb-[0.12rem]">
                    <div className={`relative rounded-full flex items-center justify-center bg-[${member.color}] h-[2.14rem] w-[2.14rem]  i unselectable`}>
                      {member.avatar ? (
                        <img
                          src={`${member.avatar}`}
                          alt=""
                          className="rounded-full"
                        />
                      ) : (
                        <img src="/log.png" alt="" className="w-[80%]" />
                      )}
                      <div className={`absolute bottom-0 right-0 w-[0.55rem] h-[0.55rem] ${onlineUsers.find(user => member._id === user) ? "bg-[#23a55a]" : "bg-[#d63030]"} rounded-full`}></div>
                    </div>
                    <h1 className="font-inter font-semibold text-base text-[#D8D8D8] ml-[0.8rem] whitespace-nowrap">
                      {member.username}
                    </h1>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {createServerPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div
              className={`bg-[#31302B] p-6 w-[30rem] rounded-lg shadow-xl ${
                isClosing ? "fade-out" : "fade-in"
              }`}
            >
              <h2 className="text-2xl text-[#f7f7f5] text-center font-bold mb-1">
                Create New Server
              </h2>
              <p className="font-inter mb-6 text-center font-thin px-6 text-base text-[#979ba2]">
                Give your new server a personality with a name. You cannot
                change it later.
              </p>
              <form>
                <label
                  className="block text-gray-300 text-xs mb-1 font-bold"
                  htmlFor="username"
                >
                  SERVER NAME
                </label>
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

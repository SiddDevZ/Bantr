import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import axios from 'axios';
import Cookies from "js-cookie";
import config from '../../../../config.json'

const Invite = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [serverId, setServerId] = useState(params.serverId);
  const token = Cookies.get("token");

  if (!token) {
    navigate("/login");
    throw new Error("No authentication token found");
  }

  useEffect(() => {
    const joinServer = async () => {
      try {
        const response = await axios.post(`${config.url}/invite`, {
          token,
          serverId,
        });

        if (response.status === 200) {
          if (response.data && response.data.server && response.data.server._id) {
            navigate(`/chat/${response.data.server._id}`);
          } else {
            console.error('Server ID not found in response');
          }
        } else if (response.status === 404) {
          console.error('Server not found');
        } else {
          console.error('Unexpected response status:', response.status);
        }
      } catch (error) {
        console.error('Error joining server:', error);
      }
    };

    joinServer();
  }, [navigate, token, serverId]);

  return <div className='h-full w-full bg-[#383631]'>Joining server...</div>;
};

export default Invite;
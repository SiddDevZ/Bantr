import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const DiscordCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const fragment = new URLSearchParams(location.hash.slice(1));
      const accessToken = fragment.get('access_token');

      if (accessToken) {
        try {
          // Fetch user data from Discord
          const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });

          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data from Discord');
          }

          const userData = await userResponse.json();

          const backendResponse = await fetch('http://localhost:3000/api/discordlogin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
        //   throw new Error(JSON.stringify(userData))

          if (backendResponse.status === 200){
            const backendData = await backendResponse.json();
            Cookies.set('token', backendData, { expires: 365 * 20, sameSite: 'None', secure: true });

            navigate('/chat');

          } else {
            throw new Error("Please try any other login method ", backendResponse.json())
          }

        } catch (err) {
          console.error('Error during authentication: ', err);
          setError(err.message);
        }
      } else {
        setError('No access token found in the URL');
      }
    };

    handleCallback();
  }, [location, navigate]);

  if (error) {
    return <div className='text-white'>Error: {error}</div>;
  }

  return <div className='text-white'>Processing Discord login...</div>;
};

export default DiscordCallback;
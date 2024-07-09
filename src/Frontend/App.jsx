import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Landing from './Pages/Landing/Landing';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import AuthCallback from './Components/Callback/Discord'
import Chat from './Pages/Chat/Chat';

function App() {
  return (
    <GoogleOAuthProvider clientId="810323618882-hk5ap966pg6j67oeakle4a3u02img0v7.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/discord/callback" element={<AuthCallback />} />
          {/* <Route path="/chat" element={<Chat />} /> */}
          <Route path="/chat/:serverId/:channelId" element={<Chat />} />
          <Route path="/chat/:serverId" element={<Chat />} />
          <Route path="/chat" element={<Chat />} />
          {/* <Route path="/contact" element={<Home />} */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App

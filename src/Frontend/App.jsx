import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing/Landing';
import Login from './Pages/Login/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/sign-up" element={<SignUp />} /> */}
        {/* <Route path="/chat" element={<Chat />} /> */}
        {/* <Route path="/contact" element={<Home />} */}
      </Routes>
    </Router>
  )
}

export default App

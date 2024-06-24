import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing/Landing';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        {/* <Route path="/sign-in" element={<SignIn />} /> */}
        {/* <Route path="/sign-up" element={<SignUp />} /> */}
        {/* <Route path="/chat" element={<Chat />} /> */}
        {/* <Route path="/contact" element={<Home />} */}
      </Routes>
    </Router>
  )
}

export default App

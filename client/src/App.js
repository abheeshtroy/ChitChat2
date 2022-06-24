import React, { useState} from "react";
import {BrowserRouter, Routes , Route} from 'react-router-dom'


import ChatPage from './components/ChatPage'
import LogReg from './components/LogReg'

import './components/App.css'


function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if(!loggedIn) {
    return <LogReg setLoggedIn={setLoggedIn}/>
  }
  return (
    <div className='App'>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage/>} />
      </Routes>
    </BrowserRouter>
  </div>

  );
}

export default App;

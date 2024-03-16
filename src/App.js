import './App.css';
import React, { useState } from 'react';
import CRUD from './CRUD';
import LoginForm from './Login';
import User from './User';
import UserManagement from './UserManagement';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 
function App() {
 
  const [userName, setName] = useState('');
 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm setName={setName} />} />
        <Route path="/crud" element={<CRUD userName={userName} />} />
        <Route path="/user" element={<User userName={userName}/>} />
        <Route path="/userManagement" element={<UserManagement userName={userName}/>} />
      </Routes>
    </Router>
  );
}
 
export default App;
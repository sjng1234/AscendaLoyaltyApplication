// Routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "../pages/LoginPage";
import LandingPage from '../pages/LandingPage';
import UserListingPage from '../pages/UserListingPage';
import AddUserPage from '../pages/AddUserPage';
import LogsPage from '../pages/LogsPage';

function Routing() {
  return (
   
      <Routes>
        <Route exact path="/" element={<LandingPage/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/users" element={<UserListingPage/>}/>
        <Route exact path="/addUser" element={<AddUserPage type="add"/>}/>
        <Route exact path="/updateUser" element={<AddUserPage type="update"/>}/>
        <Route exact path="/logs" element={<LogsPage/>}/>
       
      </Routes>
   
  );
}

export default Routing;

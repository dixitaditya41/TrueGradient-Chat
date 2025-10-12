import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";

const App = () => {
  return (
      <Routes>
         
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        
      </Routes>
  );
};

export default App;

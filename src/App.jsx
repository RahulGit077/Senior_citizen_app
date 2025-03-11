import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import HomePage from "./components/HomePage/HomePage";
import Medicines from "./components/HomePage/Medicines";
import Food from "./components/HomePage/Food"
import Groceries from "./components/HomePage/Groceries"
import Cab from "./components/HomePage/Cab"
import SOS from "./components/HomePage/Sos";

function App() {
  return (
  
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/medicines" element={<Medicines/>}/>
        <Route path="/food" element={<Food/>}/>
        <Route path="/groceries" element={<Groceries/>}/>
        <Route path="/cab" element={<Cab/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import SpecificPost from "./pages/SpecificPost";

const App = () => {
  return (
    <div className="bg-[#f7f4ed] w-full min-h-screen">
      <Navbar />
      <Login />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<SpecificPost />} />
      </Routes>
    </div>
  );
};

export default App;

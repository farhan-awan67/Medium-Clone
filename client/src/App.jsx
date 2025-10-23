import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import SpecificPost from "./pages/SpecificPost";
import ProfilePage from "./pages/ProfilePage";
import { useDispatch } from "react-redux";
import { toggleLogin } from "./features/uiSlice";
import { getCurrentUser } from "./features/authSlice";
import Loading from "./components/Loading";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(getCurrentUser());
    }
  }, []);

  return (
    <div className="bg-[#f7f4ed] w-full min-h-screen">
      <Navbar />
      <Login />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<SpecificPost />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default App;

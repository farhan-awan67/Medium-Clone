import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import SpecificPost from "./pages/SpecificPost";
import ProfilePage from "./pages/ProfilePage";
import NewPost from "./pages/NewPost";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./features/authSlice";
import {
  addNotification,
  getAllUnreadNotifications,
} from "./features/notificationsSlice";
import socket from "./socket";
import DraftPosts from "./pages/DraftPosts";

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // notifications
  useEffect(() => {
    // if not
    if (!user?._id) return;
    // get all notifications
    dispatch(getAllUnreadNotifications);

    socket.connect();
    // when frontend connect backend successfully
    socket.on("connect", () => {
      console.log("frontend connectes backend socket");
      socket.emit("register", user?._id);
    });

    // when receive notification from backend
    socket.on("notification", (notification) => {
      // add the new notification to existing notification array
      dispatch(addNotification(notification));
      toast.success(
        `${notification?.username} ${notification?.type} your post`
      );
    });

    return () => socket.disconnect();
  }, [dispatch, user?._id]);

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
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/post/:slug" element={<SpecificPost />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/draft-posts" element={<DraftPosts />} />
      </Routes>
    </div>
  );
};

export default App;

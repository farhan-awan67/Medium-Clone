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
import toast, { Toaster } from "react-hot-toast";
import {
  addNotification,
  getAllUnreadNotifications,
} from "./features/notificationsSlice";
import socket from "./socket";
import DraftPosts from "./pages/DraftPosts";
import EditPost from "./pages/EditPost";
import ProtectedRoutes from "./components/ProtectedRoutes";
import BookmarksPage from "./pages/BookmarksPage";
import FollowersFollowingPage from "./pages/FollowersFollowingPage";
import PostsPage from "./pages/PostsPage";

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // notifications
  useEffect(() => {
    // if not
    if (!user?._id) return;
    // get all notifications
    dispatch(getAllUnreadNotifications());

    socket.connect();
    // when frontend connect backend successfully
    socket.on("connect", () => {
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

    return () => {
      socket.off("notification");
      socket.off("connect");
      socket.disconnect();
    };
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(getCurrentUser());
    }
  }, []);

  return (
    <div className="bg-[#f7f4ed] w-full min-h-screen">
      <Toaster />
      <Navbar />
      <Login />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<SpecificPost />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/new-post" element={<NewPost />} />
          <Route path="/draft-posts" element={<DraftPosts />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/user/bookmarks" element={<BookmarksPage />} />
          <Route
            path="/user/followers-following"
            element={<FollowersFollowingPage />}
          />
          <Route path="/user/posts" element={<PostsPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

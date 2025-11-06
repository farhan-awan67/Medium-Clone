import { NavLink, useNavigate } from "react-router-dom";
import { toggleLogin } from "../features/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import {
  markAllNotificationsAsRead,
  markNotificationRead,
} from "../features/notificationsSlice";
import { useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { showLogin } = useSelector((state) => state.ui);
  const { user, token } = useSelector((state) => state.auth);
  const { userNotifications } = useSelector((state) => state.notifications);
  console.log(userNotifications);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleProtectedClick = (path) => {
    if (!token) {
      toast.error("Please log in to continue");
      dispatch(toggleLogin(!showLogin));
      return;
    }
    navigate(path);
  };

  const handleNotificationClick = (id, slug) => {
    dispatch(markNotificationRead({ id }));
    navigate(`/post/${slug}`);
    setShowDropdown(!showDropdown);
  };

  // mark all notification as read
  const markAllNotificationRead = () => {
    dispatch(markAllNotificationsAsRead())
      .unwrap()
      .then((res) => toast.success(res.message))
      .catch((err) => toast.error(err));
  };

  // logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="border-b px-4 sm:px-10 flex justify-between items-center h-[70px] bg-white">
      <h1
        onClick={() => navigate("/")}
        className="text-[32px] font-bold cursor-pointer select-none"
      >
        WriteUp
      </h1>

      <div className="flex items-center gap-8 font-medium">
        {/* Write Post (protected) */}
        <button
          onClick={() => handleProtectedClick("/new-post")}
          className="hover:text-[#007aff] cursor-pointer leading-tighter hidden sm:block "
        >
          Write Post
        </button>

        {/* Draft Posts (protected) */}
        <button
          onClick={() => handleProtectedClick("/draft-posts")}
          className="hover:text-[#007aff] cursor-pointer leading-tighter hidden sm:block "
        >
          Draft Posts
        </button>

        {/* Notifications */}
        {token && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="relative focus:outline-none cursor-pointer"
            >
              <span className="text-md">🔔</span>
              {userNotifications?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-[5px] py-px">
                  {userNotifications.length}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-[280px] bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                {userNotifications.length === 0 ? (
                  <p className="text-gray-500 text-sm p-4 text-center">
                    No new notifications
                  </p>
                ) : (
                  userNotifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() =>
                        handleNotificationClick(n._id, n.post.slug)
                      }
                      className={`p-3 border-b border-gray-100 cursor-pointer transition ${
                        n.read
                          ? "bg-white hover:bg-gray-50"
                          : "bg-blue-50 hover:bg-blue-100"
                      }`}
                    >
                      <p
                        className="w-full text-end"
                        onClick={markAllNotificationRead}
                      >
                        Mark all notification as read
                      </p>
                      <div className="flex justify-between items-center">
                        <img
                          src={n.actor.avatarUrl || "/default-avatar.png"}
                          alt="User avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <p className="text-sm text-gray-800 leading-tighter  ">
                          <span className="font-semibold leading-tighter ">
                            {n.actor.username}
                          </span>{" "}
                          {n.type === "like" && "liked your post"}
                          {n.type === "comment" && "commented on your post"}
                          {n.type === "bookmark" && "bookmarked your post"}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Profile / Login */}
        {token ? (
          <div className="group relative cursor-pointer">
            {user?.avatarUrl !== "" ? (
              <img
                src={user?.avatarUrl || "/default-avatar.png"}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                {user?.username?.split("")[0]}
              </div>
            )}
            <ul className="hidden group-hover:block w-[130px] rounded bg-[#fdf8f8] absolute z-10 -right-1 top-9.5 sm:-right-6 sm:top-8.5 p-2 shadow-lg">
              {/* Write Post (protected) */}
              <li
                onClick={() => handleProtectedClick("/new-post")}
                className="text-sm p-1.5 hover:bg-gray-100 rounded block sm:hidden "
              >
                Write Post
              </li>

              {/* Draft Posts (protected) */}
              <li
                onClick={() => handleProtectedClick("/draft-posts")}
                className="text-sm p-1.5 hover:bg-gray-100 rounded block sm:hidden "
              >
                Draft Posts
              </li>
              <li
                onClick={() => {
                  navigate("/profile");
                }}
                className="text-sm p-1.5 hover:bg-gray-100 rounded"
              >
                Profile
              </li>
              <li
                onClick={() => navigate("/user/bookmarks")}
                className="text-sm p-1.5 hover:bg-gray-100 rounded"
              >
                Bookmarks
              </li>
              <li
                onClick={() => navigate("/user/followers-following")}
                className="text-sm p-1.5 hover:bg-gray-100 rounded"
              >
                followers-following
              </li>
              <li
                onClick={() => navigate("/user/posts")}
                className="text-sm p-1.5 hover:bg-gray-100 rounded"
              >
                Posts
              </li>
              <li
                onClick={handleLogout}
                className="text-sm p-1.5 hover:bg-gray-100 rounded"
              >
                Logout
              </li>
            </ul>
          </div>
        ) : (
          <button
            onClick={() => dispatch(toggleLogin(!showLogin))}
            className="cursor-pointer px-6 py-2 bg-black transition text-white rounded-full"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

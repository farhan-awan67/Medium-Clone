import { NavLink, useNavigate } from "react-router-dom";
import { toggleLogin } from "../features/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import { markNotificationRead } from "../features/notificationsSlice";
import { useState } from "react";

const Navbar = () => {
  const { showLogin } = useSelector((state) => state.ui);
  const { user, token } = useSelector((state) => state.auth);
  const { userNotifications } = useSelector((state) => state.notifications);
  console.log(userNotifications);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNotificationClick = (id, postId) => {
    // mark as read
    dispatch(markNotificationRead({ id }));
    // navigate to the post (optional)
    // if (postId) navigate(`/post/${postId}`);
  };

  return (
    <nav className="border-b px-4 sm:px-10 flex justify-between items-center h-[70px] bg-white">
      <h1
        onClick={() => navigate("/")}
        className="text-[32px] font-bold cursor-pointer select-none"
      >
        WriteUp
      </h1>

      {/* nav items */}
      <div className="flex items-center gap-8 font-medium">
        {/* Write Post */}
        <NavLink to="/new-post" className="hover:text-[#007aff]">
          Write Post
        </NavLink>

        {/* Notifications */}
        {token && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="relative focus:outline-none cursor-pointer"
            >
              <span className="text-md">🔔</span>
              {userNotifications?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-[5px] py-[1px]">
                  {userNotifications.length}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-[280px] bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[320px] overflow-y-auto">
                {userNotifications.length === 0 ? (
                  <p className="text-gray-500 text-sm p-4 text-center">
                    No new notifications
                  </p>
                ) : (
                  userNotifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleNotificationClick(n._id, n.postId)}
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">{n.senderName}</span>{" "}
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
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Profile / Login */}
        {token ? (
          <div className="group relative cursor-pointer">
            <img
              src={user?.avatarUrl || "/default-avatar.png"}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <ul className="hidden group-hover:block w-[110px] rounded bg-[#fdf8f8] absolute z-10 -right-6 top-8.5 p-2 shadow-lg">
              <li
                onClick={() => navigate("/profile")}
                className="text-sm p-1.5 hover:bg-gray-100 rounded"
              >
                Profile
              </li>
              <li
                onClick={() => dispatch(logout())}
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

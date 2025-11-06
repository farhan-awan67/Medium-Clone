import React from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { toggleLogin } from "../features/uiSlice";
import { toggleFollow } from "../features/interactions";

const PersonRow = ({ avatarUrl, username, bio, _id }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { showLogin } = useSelector((state) => state.ui);

  // check if user is following this person
  const inFollowing = user?.following?.some((f) => f._id === _id);
  const inFollower = user?.followers?.some((f) => f._id === _id);

  const requireLogin = () => {
    if (!user?._id) {
      toast.error("Please log in to continue");
      dispatch(toggleLogin(!showLogin));
      return false;
    }
    return true;
  };

  const handleFollow = (e) => {
    e.stopPropagation();
    if (!requireLogin()) return;
    dispatch(toggleFollow({ id: _id }));
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition cursor-pointer">
      <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 overflow-hidden">
        {avatarUrl ? (
          <img
            src={avatarUrl || "/default-avatar.png"}
            alt={username}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-medium text-base">
            {username.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {username}
        </div>
        <div className="text-xs text-gray-500 truncate">{bio}</div>
      </div>

      {user?._id !== _id && (
        <button
          onClick={handleFollow}
          className={`ml-auto cursor-pointer px-4 py-1 rounded text-sm font-medium transition ${
            inFollowing
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {inFollowing ? "Unfollow" : "Follow +"}
        </button>
      )}
    </div>
  );
};

export default PersonRow;

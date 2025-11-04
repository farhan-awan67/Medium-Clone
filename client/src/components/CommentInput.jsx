import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../features/interactions";
import { toggleLogin } from "../features/uiSlice";
import toast from "react-hot-toast";

const CommentInput = ({ postId }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { showLogin } = useSelector((state) => state.ui);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = comment.trim();

    if (!token) {
      toast.error("Please log in to comment");
      dispatch(toggleLogin(!showLogin));
      return;
    }

    if (!text) return;

    dispatch(addComment({ postId, comment: text }))
      .unwrap()
      .then(() => toast.success("Comment added"))
      .catch(() => toast.error("Failed to add comment"));

    setComment("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-2xl mt-6 p-4 border border-gray-200 rounded-md"
    >
      <div className="flex items-start space-x-4">
        <img
          src={user?.avatarUrl || "/default-avatar.png"}
          alt="User avatar"
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex-1">
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm resize-none"
          ></textarea>

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!token}
              className={`px-4 py-1.5 cursor-pointer text-white text-sm rounded-md transition ${
                token
                  ? "bg-black hover:bg-gray-800"
                  : "bg-gray-400 opacity-50 cursor-not-allowed"
              }`}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentInput;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../features/interactions";

const CommentInput = ({ postId }) => {
  const { token, user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimComment = comment.trim();

    if (!trimComment) return;

    dispatch(
      addComment({
        postId,
        comment: trimComment, // just the text here
      })
    );

    return setComment("");
  };

  return (
    <div
      onClick={(e) => e.preventDefault()}
      className="w-full max-w-2xl mt-6 p-4 border border-gray-200 rounded-md"
    >
      <div className="flex items-start space-x-4">
        {/* User Avatar */}
        <img
          src={user?.avatarUrl || null}
          alt="User avatar"
          className="w-10 h-10 rounded-full object-cover "
        />

        {/* Textarea and Button */}
        <div className="flex-1">
          <textarea
            rows="3"
            name="comment"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm resize-none"
          ></textarea>

          {/* Submit Button (no functionality yet) */}
          <div
            onClick={(e) => handleSubmit(e)}
            className="flex justify-end mt-2"
          >
            <button
              disabled={!token}
              className={`px-4 py-1.5 text-white text-sm rounded-md transition cursor-pointer
    ${
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
    </div>
  );
};

export default CommentInput;

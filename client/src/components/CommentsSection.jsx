import React, { useState } from "react";
import CommentInput from "./CommentInput";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { deleteComment, updateComment } from "../features/interactions";

const CommentsSection = ({ postId, comments }) => {
  const [menuId, setMenuId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");
  const dispatch = useDispatch();
  let currentComment;

  const commentDelete = (id) => {
    dispatch(deleteComment({ id, postId }));
  };

  const saveNewComment = (id) => {
    dispatch(updateComment({ id, body: updatedComment }));
    setUpdatedComment("");
    setEditId(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">
        Comments ({comments?.length})
      </h2>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {comments?.length === 0 && (
          <p className="text-gray-500 italic">No comments yet. Be the first!</p>
        )}

        {comments?.map((comment) => {
          const id = comment._id.toString();
          currentComment = comment.body;
          return (
            <div
              onClick={(e) => e.preventDefault()}
              key={id}
              className="flex space-x-4 border-b border-gray-200 pb-4 relative"
            >
              {/* Avatar */}
              <img
                src={comment.author.avatarUrl}
                alt={`${comment.author.username}'s avatar`}
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Comment Body */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">
                    {comment.author.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>

                {editId === id ? (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={updatedComment}
                      onChange={(e) => setUpdatedComment(e.target.value)}
                      placeholder="Edit your comment..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition placeholder-gray-400"
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1 text-sm rounded-md text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveNewComment(id)}
                        className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                    {comment.body}
                  </p>
                )}
              </div>

              {/* Options Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuId(menuId === id ? null : id)}
                  className="p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
                >
                  <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                </button>

                <div
                  className={`${
                    menuId === id ? "absolute" : "hidden"
                  } right-0 top-7 w-28 bg-white border border-gray-200 shadow-lg rounded-md py-1 transform transition-all duration-200 origin-top-right opacity-100 scale-100`}
                >
                  <div
                    onClick={() => {
                      setEditId(id);
                      setMenuId(null);
                      setUpdatedComment(currentComment);
                    }}
                    className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <PencilIcon className="w-4 h-4 text-gray-600" />
                    <span>Edit</span>
                  </div>

                  <div
                    onClick={() => commentDelete(id)}
                    className="flex items-center gap-2 px-2 py-1 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                    <span>Delete</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CommentInput postId={postId} />
    </div>
  );
};

export default CommentsSection;

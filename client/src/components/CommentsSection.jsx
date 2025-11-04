import React, { useState } from "react";
import CommentInput from "./CommentInput";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, updateComment } from "../features/interactions";
import toast from "react-hot-toast";

const CommentsSection = ({ postId, comments }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [menuId, setMenuId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");

  const handleDelete = (id) => {
    dispatch(deleteComment({ id, postId }))
      .unwrap()
      .then(() => toast.success("Comment deleted"))
      .catch(() => toast.error("Failed to delete comment"));
  };

  const handleUpdate = (id) => {
    if (!updatedComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    dispatch(updateComment({ id, body: updatedComment }))
      .unwrap()
      .then(() => toast.success("Comment updated"))
      .catch(() => toast.error("Failed to update comment"));

    setEditId(null);
    setUpdatedComment("");
  };

  return (
    <div
      className="w-full max-w-3xl mx-auto p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-semibold mb-4">
        Comments ({comments?.length || 0})
      </h2>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {!comments?.length && (
          <p className="text-gray-500 italic">No comments yet. Be the first!</p>
        )}

        {comments?.map((comment) => {
          const id = comment._id;
          const isOwner = user?._id === comment.author._id;

          return (
            <div
              key={id}
              className="flex space-x-4 border-b border-gray-200 pb-4 relative"
            >
              <img
                src={comment.author.avatarUrl}
                alt={`${comment.author.username}'s avatar`}
                className="w-12 h-12 rounded-full object-cover"
              />

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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1 cursor-pointer text-sm text-gray-600 rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(id)}
                        className="px-3 py-1 cursor-pointer text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
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

              {isOwner && (
                <div className="relative">
                  <button
                    onClick={() => setMenuId(menuId === id ? null : id)}
                    className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                  </button>

                  {menuId === id && (
                    <div className="absolute right-0 top-7 w-28 bg-white border border-gray-200 shadow-lg rounded-md py-1 z-10">
                      <div
                        onClick={() => {
                          setEditId(id);
                          setMenuId(null);
                          setUpdatedComment(comment.body);
                        }}
                        className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <PencilIcon className="w-4 h-4 text-gray-600" />
                        <span>Edit</span>
                      </div>

                      <div
                        onClick={() => handleDelete(id)}
                        className="flex items-center gap-2 px-2 py-1 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <TrashIcon className="w-4 h-4 text-red-500" />
                        <span>Delete</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <CommentInput postId={postId} />
    </div>
  );
};

export default CommentsSection;

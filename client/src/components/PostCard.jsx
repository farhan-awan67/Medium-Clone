// components/PostCard.jsx
import React from "react";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import dayjs from "../utils/dayjs";

const PostCard = ({ post }) => {
  // inside your component
  const timeAgo = dayjs(post.createdAt).fromNow(); // e.g., "2 hours ago"
  console.log(timeAgo);

  return (
    <div className="bg-white rounded-md shadow p-6 mb-6">
      {/* Author Section */}
      <div className="flex items-center mb-4">
        <img
          src={post?.authorImage}
          alt={post.author}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <p className="text-sm font-semibold">{post.author.username}</p>
          <p className="text-xs text-gray-500">{timeAgo}</p>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
      <p className="text-gray-700 mb-4">{post.bodyHtml}</p>

      {/* Image */}
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt="Post"
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 text-gray-600">
        <button className="flex items-center gap-1 hover:text-red-500">
          <HeartIcon className="w-5 h-5 cursor-pointer" />
          <span>{post.likes.length}</span>
        </button>
        <button className="flex items-center gap-1 hover:text-blue-500">
          <ChatBubbleLeftIcon className="w-5 h-5 cursor-pointer" />
          <span>{post.commentCount}</span>
        </button>
        <button className="ml-auto hover:text-yellow-500">
          <BookmarkIcon className="w-5 h-5 cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default PostCard;

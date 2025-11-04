import {
  BookmarkIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPostBySlug } from "../features/postSlice";

const SpecificPost = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { posts, currentPost, loading } = useSelector((state) => state.posts);

  // Try to find in Redux cache first
  const cachedPost = posts.find((p) => p.slug === slug);

  useEffect(() => {
    if (!cachedPost) {
      dispatch(getPostBySlug(slug));
    }
  }, [slug, dispatch, cachedPost]);

  const post = cachedPost || currentPost;
  const timeAgo = dayjs(post?.createdAt).fromNow(); // e.g., "2 hours ago"

  if (loading) {
    return <p className="text-center mt-10">Loading post...</p>;
  }

  // if (loading) {
  //   return <p className="text-center mt-10 text-gray-500">Post not found.</p>;
  // }

  return (
    post && (
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Cover Image */}
        <div className="mb-8">
          <img
            src={post.coverImage}
            alt="Post"
            className="w-full rounded-lg shadow-sm"
          />
        </div>

        {/* Author Section */}
        <div className="flex items-center mb-6">
          <img
            src="https://i.pravatar.cc/150?img=5"
            alt="Author"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-4">
            <p className="text-gray-800 font-semibold text-sm">
              {post.author.username}
            </p>
            <p className="text-gray-500 text-xs">{timeAgo}</p>
          </div>
          <button className="ml-auto bg-black text-white px-4 py-1 rounded hover:bg-gray-800">
            Follow
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 leading-snug">
          {post.title}
        </h1>

        {/* Content */}
        <div className="prose prose-base sm:prose-lg lg:prose-xl max-w-none dark:prose-invert mb-10">
          <p dangerouslySetInnerHTML={{ __html: post.bodyHtml }}></p>
        </div>

        {/* Interaction Buttons */}
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
    )
  );
};

export default SpecificPost;

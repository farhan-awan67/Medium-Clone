import {
  BookmarkIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getPostBySlug } from "../features/postSlice";
import Loading from "../components/Loading";

const SpecificPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { posts, currentPost, loading, error } = useSelector(
    (state) => state.posts
  );

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
    return <Loading className="w-8 h-8 mt-6" />;
  }
  // error
  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    post && (
      <div className="max-w-3xl mx-auto px-4 py-7">
        <button
          onClick={() => navigate("/")}
          className="bg-black rounded  text-white p-2 text-sm mb-3 cursor-pointer"
        >
          Go Back
        </button>
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

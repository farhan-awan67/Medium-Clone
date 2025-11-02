// components/PostCard.jsx
import {
  ChatBubbleLeftIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import { BookmarkIcon as NotFilled } from "@heroicons/react/24/outline";

import { Link, useNavigate } from "react-router-dom";
import dayjs from "../utils/dayjs";
import { useSelector, useDispatch } from "react-redux";
import {
  addBookmark,
  getComments,
  toggleFollow,
  toggleLikes,
} from "../features/interactions";
import { useEffect, useRef, useState } from "react";
import CommentInput from "../components/CommentInput";
import CommentsSection from "./CommentsSection";

const PostCard = ({ post }) => {
  const { followStatus, likesStatus, commentsByPost, bookmark } = useSelector(
    (state) => state.interactions
  );
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // inside your component
  const timeAgo = dayjs(post.createdAt).fromNow(); // e.g., "2 hours ago"
  const isFollowing = followStatus?.isFollowing;
  const isLiked = likesStatus?.like ?? post.isLiked;
  const likeCount = likesStatus?.likeCount ?? post.likes.length;
  const comments = commentsByPost[post._id] || [];
  const commentCounts = comments?.length || post?.commentCount || 0;
  const isBookmarked =
    bookmark?.[post?._id] ?? post?.bookmarks?.includes(user?._id);

  const [comment, setShowComment] = useState(false);
  const commentRef = useRef(null);
  const [postOptions, setPostOPtions] = useState(false);

  // follow unfollow user
  const followUnfollow = (e) => {
    e.preventDefault();
    dispatch(toggleFollow({ id: post.author._id.toString() }));
  };

  // like unlike user
  const userLike = (e) => {
    e.preventDefault();
    dispatch(toggleLikes({ id: post._id?.toString() }));
  };

  // toggleBookmark
  const toggleBookmark = (id) => {
    dispatch(addBookmark({ id }));
  };

  // post options
  const showPostOptions = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPostOPtions(!postOptions);
  };

  useEffect(() => {
    if (comment && commentRef.current) {
      const yOffset = -190; // adjust this offset as needed (e.g., -50, -150)
      const y =
        commentRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [comment]);

  useEffect(() => {
    dispatch(getComments({ postId: post._id }));
  }, [dispatch, post._id]);

  return (
    <Link
      to={`/post/${post.slug}`}
      className="block rounded-md shadow p-6 mb-6 bg-white"
    >
      {/* Author Section */}
      <div className="flex items-center mb-4">
        <img
          src={post?.author?.avatarUrl}
          alt={post?.author}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <p className="text-sm font-semibold">{post.author.username}</p>
          <p className="text-xs text-gray-500">{timeAgo}</p>
        </div>
        <button
          onClick={(e) => followUnfollow(e)}
          className="ml-auto text-black cursor-pointer"
        >
          {isFollowing ? "follow +" : "unfollow"}
        </button>
        <div className="relative">
          <EllipsisVerticalIcon
            onClick={(e) => showPostOptions(e)}
            className="h-5 w-5 text-gray-600 ml-1 cursor-pointer"
          />

          {postOptions && (
            <div className="absolute right-0 mt-2 w-[110px] rounded bg-[#fdf8f8] z-10 p-2 shadow-lg">
              <ul>
                <li
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/edit-post/${post._id}`);
                  }}
                  className="text-sm p-1.5 hover:bg-gray-100 rounded cursor-pointer"
                >
                  Edit Post
                </li>
                <li
                  onClick={() => dispatch(logout())}
                  className="text-sm p-1.5 hover:bg-gray-100 rounded cursor-pointer"
                >
                  Delete Post
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
      <p className="text-gray-700 mb-4">{post.excerpt}</p>

      {/* Image */}
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt="Post"
          className="w-full h-64 object-cover rounded mb-4 border border-zinc-100"
        />
      )}

      {/* Actions */}
      <div
        onClick={(e) => e.preventDefault()}
        className="flex items-center gap-6 text-gray-600"
      >
        <button
          onClick={(e) => userLike(e)}
          className="flex items-center gap-1 hover:text-red-500"
        >
          {isLiked ? (
            <SolidHeartIcon className="w-5 h-5 cursor-pointer" />
          ) : (
            <OutlineHeartIcon className="w-5 h-5 cursor-pointer" />
          )}

          <span>{likeCount}</span>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowComment(!comment);
          }}
          className="flex items-center gap-1 hover:text-blue-500"
        >
          <ChatBubbleLeftIcon className="w-5 h-5 cursor-pointer" />
          <span>{commentCounts}</span>
        </button>
        <button
          onClick={() => toggleBookmark(post._id.toString())}
          className="ml-auto hover:text-yellow-500"
        >
          {isBookmarked ? (
            <BookmarkIcon className="h-6 w-6 text-black cursor-pointer" />
          ) : (
            <NotFilled className="w-5 h-5 cursor-pointer inset-0" />
          )}
        </button>
      </div>
      {comment ? (
        <div ref={commentRef}>
          <CommentsSection postId={post._id} comments={comments} />
        </div>
      ) : (
        ""
      )}
    </Link>
  );
};

export default PostCard;

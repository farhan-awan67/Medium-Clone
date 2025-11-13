import {
  BookmarkIcon as OutlineBookmarkIcon,
  ChatBubbleLeftIcon,
  HeartIcon as OutlineHeartIcon,
} from "@heroicons/react/24/outline";
import {
  BookmarkIcon as SolidBookmarkIcon,
  HeartIcon as SolidHeartIcon,
} from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deletePostBySlug, getPostBySlug } from "../features/postSlice";
import Loading from "../components/Loading";
import CommentsSection from "../components/CommentsSection";
import { addBookmark, getComments } from "../features/interactions";
import toast from "react-hot-toast";
import { toggleLogin } from "../features/uiSlice";
import { toggleFollow, toggleLikes } from "../features/interactions";

const SpecificPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const { posts, currentPost, loading, error } = useSelector(
    (state) => state.posts
  );
  const { user } = useSelector((state) => state.auth);
  const { showLogin } = useSelector((state) => state.ui);
  const { followStatus, likesStatus, commentsByPost, bookmark } = useSelector(
    (state) => state.interactions
  );

  const cachedPost = posts.find((p) => p.slug === slug);
  const post = cachedPost || currentPost;

  const isLiked =
    likesStatus?.[post?._id]?.like ?? post?.likes?.includes(user?._id) ?? false;

  const likeCount =
    likesStatus?.[post?._id]?.likeCount ?? (post?.likes?.length || 0);

  const comments = commentsByPost[post?._id] || [];
  const commentCount = comments.length || post?.commentCount || 0;
  const isBookmarked =
    bookmark?.[post?._id] ?? post?.bookmarks?.includes(user?._id);

  const [showComments, setShowComments] = useState(false);
  const commentRef = useRef(null);

  const requireLogin = () => {
    if (!user?._id) {
      toast.error("Please log in to continue");
      dispatch(toggleLogin(!showLogin));
      return false;
    }
    return true;
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (!requireLogin()) return;
    dispatch(toggleLikes({ id: post._id }));
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (!requireLogin()) return;
    dispatch(addBookmark({ id: post._id }));
  };

  const handleShowComments = (e) => {
    e.stopPropagation();
    if (!requireLogin()) return;
    const toggled = !showComments;
    setShowComments(toggled);

    if (toggled) {
      dispatch(getComments({ postId: post._id }));
      setTimeout(() => {
        if (commentRef.current) {
          const yOffset = -180;
          const y =
            commentRef.current.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 150);
    }
  };

  const handleDeletePost = (slug) => {
    if (!requireLogin()) return;
    dispatch(deletePostBySlug({ slug }))
      .unwrap()
      .then((res) =>
        toast.success(res?.data?.message || "Post deleted successfully")
      )
      .catch(() => toast.error("Something went wrong"));
  };

  useEffect(() => {
    if (!cachedPost) dispatch(getPostBySlug({ slug }));
  }, [slug, dispatch, cachedPost]);

  const timeAgo = dayjs(post?.createdAt).fromNow();

  if (loading) return <Loading className="w-8 h-8 mt-6" />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-7">
      <button
        onClick={() => navigate("/")}
        className="bg-black rounded text-white p-2 text-sm mb-3 cursor-pointer"
      >
        Go Back
      </button>

      <div className="mb-8">
        <img
          src={post.coverImage}
          alt="Post"
          className="w-full rounded-lg shadow-sm"
        />
      </div>

      <div className="flex items-center mb-6">
        <img
          src={post?.author?.avatarUrl || "default.png"}
          alt="Author"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-4">
          <p className="text-gray-800 font-semibold text-sm">
            {post.author.username}
          </p>
          <p className="text-gray-500 text-xs">{timeAgo}</p>
        </div>
        <button className="ml-auto bg-black text-white px-4 py-1 rounded hover:bg-gray-800 cursor-pointer">
          Follow
        </button>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold mb-6 leading-snug">
        {post.title}
      </h1>

      <div
        className="prose prose-base sm:prose-lg lg:prose-xl max-w-none dark:prose-invert mb-10"
        dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
      ></div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-6 text-gray-600"
      >
        <button
          onClick={handleLike}
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
          onClick={handleShowComments}
          className="flex items-center gap-1 hover:text-blue-500"
        >
          <ChatBubbleLeftIcon className="w-5 h-5 cursor-pointer" />
          <span>{commentCount}</span>
        </button>

        <button
          onClick={handleBookmark}
          className="ml-auto hover:text-yellow-500"
        >
          {isBookmarked ? (
            <SolidBookmarkIcon className="h-6 w-6 text-black cursor-pointer" />
          ) : (
            <OutlineBookmarkIcon className="w-5 h-5 cursor-pointer" />
          )}
        </button>
      </div>

      {showComments && (
        <div ref={commentRef}>
          <CommentsSection postId={post._id} comments={comments} />
        </div>
      )}
    </div>
  );
};

export default SpecificPost;

import {
  ChatBubbleLeftIcon,
  EllipsisVerticalIcon,
  HeartIcon as OutlineHeartIcon,
  BookmarkIcon as OutlineBookmarkIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as SolidHeartIcon,
  BookmarkIcon as SolidBookmarkIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import dayjs from "../utils/dayjs";
import { useSelector, useDispatch } from "react-redux";
import {
  addBookmark,
  getComments,
  toggleFollow,
  toggleLikes,
} from "../features/interactions";
import { useEffect, useRef, useState } from "react";
import CommentsSection from "./CommentsSection";
import { deletePostBySlug } from "../features/postSlice";
import { toggleLogin } from "../features/uiSlice";
import toast from "react-hot-toast";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { showLogin } = useSelector((state) => state.ui);
  const { followStatus, likesStatus, commentsByPost, bookmark } = useSelector(
    (state) => state.interactions
  );

  const timeAgo = dayjs(post.createdAt).fromNow();
  const isFollowing = followStatus?.isFollowing;
  const postLikes = likesStatus?.[post?._id];
  const isLiked = postLikes?.like ?? post.likes.includes(user?._id);
  const likeCount = postLikes?.likeCount ?? post.likes.length;
  const comments = commentsByPost[post._id] || [];
  const commentCount = comments?.length || post?.commentCount || 0;
  const isBookmarked =
    bookmark?.[post?._id] ?? post?.bookmarks?.includes(user?._id);

  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const commentRef = useRef(null);

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
    dispatch(toggleFollow({ id: post.author._id }));
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

  const toggleOptions = (e) => {
    e.stopPropagation();
    setShowOptions((prev) => !prev);
  };

  useEffect(() => {
    const closeMenu = () => setShowOptions(false);
    if (showOptions) {
      document.addEventListener("click", closeMenu);
    }
    return () => document.removeEventListener("click", closeMenu);
  }, [showOptions]);

  const handleNavigate = () => {
    navigate(`/post/${post.slug}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="block rounded-md shadow p-6 mb-6 bg-white cursor-pointer"
    >
      {/* Author Section */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full object-cover bg-gray-100 flex items-center justify-center text-gray-600 overflow-hidden">
          {post?.author?.avatarUrl ? (
            <img
              onClick={(e) => {
                e.stopPropagation(),
                  navigate(`/user/${post.author._id.toString()}/profile`);
              }}
              src={post?.author?.avatarUrl || "/default-avatar.png"}
              alt={post?.author?.username || "Author avatar"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-medium text-base">
              {post?.author?.username?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation(),
              navigate(`/user/${post.author._id.toString()}/profile`);
          }}
          className="ml-3"
        >
          <p className="text-sm font-semibold">{post.author.username}</p>
          <p className="text-xs text-gray-500">{timeAgo}</p>
        </div>

        {user?._id !== post.author._id && (
          <button
            onClick={handleFollow}
            className="ml-auto bg-black text-white px-4 py-1 rounded hover:bg-gray-800 cursor-pointer"
          >
            {isFollowing ? "Unfollow" : "Follow +"}
          </button>
        )}

        {user?._id === post.author._id && (
          <div className="relative ml-auto">
            <EllipsisVerticalIcon
              onClick={toggleOptions}
              className="h-5 w-5 text-gray-600 cursor-pointer"
            />

            {showOptions && (
              <div className="absolute right-0 mt-2 w-[110px] rounded bg-[#fdf8f8] z-10 p-2 shadow-lg">
                <ul>
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-post/${post._id}`);
                    }}
                    className="text-sm p-1.5 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    Edit Post
                  </li>
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(post.slug);
                    }}
                    className="text-sm p-1.5 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    Delete Post
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
      <div
        className="prose prose-base sm:prose-lg lg:prose-xl max-w-none dark:prose-invert mb-10"
        dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
      ></div>

      {post.coverImage && post.coverImage.trim() !== "" && (
        <img
          src={post.coverImage}
          alt="Post cover"
          className="w-full h-64 object-cover rounded mb-4 border border-zinc-100"
        />
      )}

      {/* Actions */}
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

      {/* Comments Section */}
      {showComments && (
        <div ref={commentRef}>
          <CommentsSection postId={post._id} comments={comments} />
        </div>
      )}
    </div>
  );
};

export default PostCard;

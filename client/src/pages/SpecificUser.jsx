import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSpecificUser } from "../features/authSlice";

const SpecificUser = () => {
  const { specificUserProfile } = useSelector((state) => state.auth);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getSpecificUser({ id }));
  }, [id]);

  return (
    specificUserProfile && (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center px-4 py-10">
        {/* Profile Header */}
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
          <div
            className={`rounded-full flex justify-center items-center w-20 h-20 overflow-hidden ${
              specificUserProfile?.avatarUrl === "" && "border"
            }`}
          >
            {specificUserProfile?.avatarUrl ? (
              <img
                src={specificUserProfile?.avatarUrl || "/default-avatar.png"}
                alt={specificUserProfile?.username || "Author avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-medium text-base">
                {specificUserProfile?.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold mt-1">
            {specificUserProfile.name}
          </h1>
          <p className="text-gray-500">@{specificUserProfile.username}</p>
          <p className="mt-2 text-gray-700">{specificUserProfile.bio}</p>

          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold">
                {specificUserProfile?.followers?.length}
              </span>{" "}
              Followers
            </div>
            <div>
              <span className="font-semibold">
                {specificUserProfile.following?.length}
              </span>{" "}
              Following
            </div>
            <div>
              <span className="font-semibold">
                {specificUserProfile.posts?.length}
              </span>{" "}
              Posts
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 w-full pt-4 text-sm text-gray-500">
            <p>Email: {specificUserProfile.email}</p>
            <p>
              Joined:{" "}
              {new Date(specificUserProfile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* User’s Posts Section */}
        <div className="max-w-3xl w-full mt-10">
          <h2 className="text-lg font-semibold mb-4">
            Posts by {specificUserProfile.name}
          </h2>
          {specificUserProfile.posts?.length === 0 ? (
            <p className="text-gray-500 text-center bg-white py-8 rounded-lg shadow-sm">
              No posts yet.
            </p>
          ) : (
            <div className="space-y-4">
              {specificUserProfile.posts &&
                specificUserProfile.posts?.map((post) => (
                  <div
                    key={post.slug}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row overflow-hidden"
                  >
                    {/* Cover Image */}
                    <div className="m-2 rounded overflow-hidden">
                      {post.coverImage && (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full sm:w-48 h-full object-cover "
                        />
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <h3
                          onClick={() => navigate(`/post/${post.slug}`)}
                          className="text-xl font-semibold mb-2 hover:text-green-700 cursor-pointer"
                        >
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Author Info */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-10 h-10 rounded-full object-cover bg-gray-100 flex items-center justify-center text-gray-600 overflow-hidden">
                            {post?.author?.avatarUrl ? (
                              <img
                                src={
                                  post?.author?.avatarUrl ||
                                  "/default-avatar.png"
                                }
                                alt={post?.author?.username || "Author avatar"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="font-medium text-base">
                                {post?.author?.username
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span>{post.author.username}</span>
                          <span>•</span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between flex-col gap-2 text-xs text-gray-500 mt-3">
                        <div className="flex gap-4">
                          <span>{post.readTime} min read</span>
                          <span>{post.views} views</span>
                          <span>{post.likes.length} likes</span>
                          <span>{post.commentCount} comments</span>
                        </div>
                        {post?.tags?.length > 0 && (
                          <div className="flex gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default SpecificUser;

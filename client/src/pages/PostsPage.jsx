import React from "react";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";

const Tag = ({ children }) => (
  <span className="inline-block text-xs px-2 py-1 rounded-full border border-gray-200 bg-white text-gray-600 mr-2">
    {children}
  </span>
);

const PostCard = ({ title, excerpt, author, coverImage, readTime, tags }) => (
  <article className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition">
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="shrink-0 w-full sm:w-44 h-28 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden">
        {coverImage && (
          <img className="w-full h-full" src={coverImage} alt={title} />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{author?.username}</span>
          <span>{readTime} min read</span>
        </div>

        <h3 className="mt-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{excerpt}</p>

        <div className="mt-3">
          {tags && tags.map((t, idx) => <Tag key={idx}>{t}</Tag>)}
        </div>
      </div>
    </div>
  </article>
);

export default function PostsPage() {
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const posts = user?.posts;

  if (loading) {
    return <Loading className="w-8 h-8 mt-6" />;
  }
  // error
  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-sm text-gray-600 mt-1">
            Recent stories from people you follow.
          </p>
        </header>

        <div className="space-y-4">
          {posts?.length > 0
            ? posts.map((p, i) => <PostCard key={i} {...p} />)
            : "No Posts."}
        </div>

        {/* <nav className="mt-8 flex items-center justify-center gap-3 text-sm">
          <button className="px-3 py-2 rounded-md bg-white border border-gray-200 text-gray-700">
            Newer
          </button>
          <span className="text-xs text-gray-500">Page 1 of 3</span>
          <button className="px-3 py-2 rounded-md bg-white border border-gray-200 text-gray-700">
            Older
          </button>
        </nav> */}
      </div>
    </main>
  );
}

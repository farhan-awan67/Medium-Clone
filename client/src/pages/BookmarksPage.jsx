import React from "react";
import { useSelector } from "react-redux";
import BookmarkCard from "../components/BookmarkCard";
import Loading from "../components/Loading";

export default function BookmarksPage() {
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const bookmarks = user?.bookmarks;

  if (loading) {
    return <Loading className="w-8 h-8 mt-6" />;
  }
  // error
  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Bookmarks
          </h1>
          <p className="mt-1 text-sm text-gray-600">Saved posts.</p>
        </header>

        <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks && bookmarks?.length > 0 ? (
            bookmarks.map((b, i) => <BookmarkCard key={i} {...b} />)
          ) : (
            <p className="text-sm text-gray-500">No Bookmark Posts.</p>
          )}
        </section>

        {/* <footer className="mt-8 text-center text-xs text-gray-500">
          Showing {bookmarks.length} bookmarks
        </footer> */}
      </div>
    </main>
  );
}

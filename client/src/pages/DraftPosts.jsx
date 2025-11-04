import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewPost,
  deletePostBySlug,
  fetchPosts,
  makePostPublished,
} from "../features/postSlice";

const DraftPosts = () => {
  const { posts } = useSelector((state) => state.posts);
  let drafts = posts?.filter((post) => post.status === "draft");
  const dispatch = useDispatch();
  //   const drafts = [
  //     {
  //       id: 1,
  //       title: "Exploring the Art of Minimal Writing",
  //       excerpt:
  //         "Minimalism in writing is about expressing more with fewer words. Here's how to master it...",
  //       image:
  //         "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=500&fit=crop",
  //     },
  //     {
  //       id: 2,
  //       title: "Understanding Async/Await in JavaScript",
  //       excerpt:
  //         "Asynchronous programming can be tricky — but async/await makes it simpler than ever.",
  //       image:
  //         "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
  //     },
  //     {
  //       id: 3,
  //       title: "The Hidden Power of Morning Routines",
  //       excerpt:
  //         "Morning routines set the tone for your entire day. Let's uncover the science behind them.",
  //       image:
  //         "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
  //     },
  //   ];

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Your Draft Posts
        </h1>

        {drafts.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No drafts yet. Start writing your first story!
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
            {drafts.map((draft) => (
              <div
                key={draft._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <img
                  src={draft.coverImage}
                  alt={draft.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      {draft.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {draft.excerpt}
                    </p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() =>
                        dispatch(makePostPublished({ id: draft._id }))
                      }
                      className="cursor-pointer text-sm font-medium text-green-600 hover:text-green-700"
                    >
                      Publish
                    </button>
                    <button
                      onClick={() =>
                        dispatch(deletePostBySlug({ slug: draft.slug }))
                      }
                      className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftPosts;

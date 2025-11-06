import React from "react";
import { useSelector } from "react-redux";
import PersonRow from "../components/PersonRow";
import Loading from "../components/Loading";

export default function FollowersFollowingPage() {
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const followers = user?.followers;
  const following = user?.following;

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
          <h1 className="text-2xl font-bold text-gray-900">Connections</h1>
          <p className="mt-1 text-sm text-gray-600">
            People you follow and people who follow you.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">
                Followers
              </h2>
              <div className="mt-4 text-xs text-gray-500">
                {followers?.length > 0 &&
                  `Total followers : ${followers.length}`}
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {followers?.length > 0
                ? followers.map((f, i) => <PersonRow key={i} {...f} />)
                : "No Followers yet."}
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">Following</h2>
              <div className="text-xs text-gray-500">
                Following {following?.length}
              </div>
            </div>
            <div className="mt-3 divide-y divide-gray-100">
              {following?.length > 0
                ? following.map((f, i) => <PersonRow key={i} {...f} />)
                : "No Following Yet."}
            </div>
            {/* <div className="mt-4 text-xs text-gray-500">People you follow</div> */}
          </section>
        </div>
      </div>
    </main>
  );
}

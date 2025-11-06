// components/TrendingTags.jsx
import React from "react";
import { useSelector } from "react-redux";

const TrendingTags = () => {
  const { trendingTags, loading, error } = useSelector((state) => state.posts);
  return (
    <div className="bg-white rounded-md shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">🔥 Trending Tags</h2>
      <div className="flex flex-wrap gap-2">
        {trendingTags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full cursor-pointer"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TrendingTags;

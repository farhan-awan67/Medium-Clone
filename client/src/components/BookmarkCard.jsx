import React from "react";

const BookmarkCard = ({ title, excerpt, author }) => {
  return (
    <article className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-md bg-gray-100 shrink-0 flex items-center justify-center text-gray-500">
          <span className="text-sm font-medium">IMG</span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{excerpt}</p>
          <div className="mt-3 text-xs text-gray-500">
            <span>{author}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BookmarkCard;

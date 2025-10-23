import React from "react";

const Loading = ({ className }) => {
  return (
    <div
      className={`${className} rounded-full border-t-4 border-t-gray-400 border-white border-4 animate-spin`}
    ></div>
  );
};

export default Loading;

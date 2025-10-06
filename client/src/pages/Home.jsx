import React, { useEffect } from "react";
import TrendingTags from "../components/TrendingTags";
import PostCard from "../components/PostCard";
import { fetchPosts } from "../features/postSlice";
import { useSelector, useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  console.log(posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  // const tags = [...new Set(posts.flatMap((post) => post.tags || []))];
  if (!posts) {
    return <p>Loading posts...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* <TrendingTags tags={tags} /> */}
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Home;

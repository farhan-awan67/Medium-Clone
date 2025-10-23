import React, { useEffect } from "react";
import TrendingTags from "../components/TrendingTags";
import PostCard from "../components/PostCard";
import { fetchPosts } from "../features/postSlice";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../components/Loading";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  // const tags = [...new Set(posts.flatMap((post) => post.tags || []))];
  if (!posts) {
    return <Loading className="w-9 h-9" />;
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

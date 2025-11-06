import React, { useEffect } from "react";
import TrendingTags from "../components/TrendingTags";
import PostCard from "../components/PostCard";
import { fetchPosts } from "../features/postSlice";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../components/Loading";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  const publishedPosts = posts?.filter((post) => post.status === "published");

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  if (loading) {
    return <Loading className="w-8 h-8 mt-6" />;
  }
  // error
  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* <TrendingTags tags={tags} /> */}
      {publishedPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Home;

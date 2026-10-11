import React, { useEffect } from "react";
import PostCard from "../components/PostCard";
import { UsePost } from "../hooks/UsePost";
import Navbar from "../../shared/components/Navbar";

const Feed = () => {
  const { loading, feed, GetAllFeed } = UsePost();

  useEffect(() => {
    GetAllFeed();
  }, []);

  if (loading || !feed) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-3" />
        <h1 className="text-zinc-400 text-sm">Loading feed...</h1>
      </div>
    );
  }

  console.log(feed);

  return (
    <div className="min-h-screen bg-black py-6 flex flex-col gap-1.5">
      <Navbar/>
      {feed.map((post) => {
        return <PostCard key={post._id} user={post.user} post={post} />;
      })}
    </div>
  );
};

export default Feed;

//   const sampleUser = {
//     username: '',
//     profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
//   }

//   // Example with Multiple Carousel Images
//   const samplePost = {
//     caption: 'Until I win. Every step counts and the journey never stops pushing forward. ♡',
//     images: [
//       'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80',
//       'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
//       'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
//     ],
//   }

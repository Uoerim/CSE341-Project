import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import PostCard from "../components/Postcard";

function PopularPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        // get all posts from feed
        const res = await api.get("/posts/feed");
        const data = res.data || [];

        // sort by score (upvotes - downvotes), highest first
        const sorted = [...data].sort((a, b) => {
          const scoreA = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
          const scoreB = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
          return scoreB - scoreA;
        });

        setPosts(sorted);
      } catch (err) {
        console.error("Failed to load popular posts", err);
      }
    };

    load();
  }, []);

  const handleVote = async (postId, type) => {
    try {
      const endpoint = type === "up" ? "upvote" : "downvote";
      await api.put(`/posts/${postId}/${endpoint}`);
      // reload list after voting
      const res = await api.get("/posts/feed");
      const data = res.data || [];
      const sorted = [...data].sort((a, b) => {
        const scoreA = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
        const scoreB = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
        return scoreB - scoreA;
      });
      setPosts(sorted);
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  return (
    <div>
      <h2>Popular</h2>
      {posts.map((p) => (
        <PostCard
          key={p._id}
          post={p}
          showCommunity
          onUpvote={() => handleVote(p._id, "up")}
          onDownvote={() => handleVote(p._id, "down")}
        />
      ))}
    </div>
  );
}

export default PopularPage;

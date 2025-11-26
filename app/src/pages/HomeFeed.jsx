import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/apiClient";
import PostCard from "../components/Postcard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function HomeFeed() {
  const [posts, setPosts] = useState([]);
  const query = useQuery();
  const searchTerm = query.get("q") || "";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/posts/feed");
        let data = res.data || [];
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          data = data.filter(
            (p) =>
              p.title.toLowerCase().includes(term) ||
              (p.content || "").toLowerCase().includes(term)
          );
        }
        setPosts(data);
      } catch (err) {
        console.error("Failed to load feed", err);
      }
    };
    load();
  }, [searchTerm]);

  const handleVote = async (postId, type) => {
    try {
      const endpoint = type === "up" ? "upvote" : "downvote";
      await api.put(`/posts/${postId}/${endpoint}`); // 
      // simple re-fetch
      const res = await api.get("/posts/feed");
      setPosts(res.data || []);
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  return (
    <div>
      <h2>Home</h2>
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

export default HomeFeed;

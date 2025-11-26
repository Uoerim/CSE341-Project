import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";
import PostCard from "../components/Postcard";

function CommunityPage() {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/communities/${communityId}`);
        setCommunity(res.data);
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("Failed to load community", err);
      }
    };
    load();
  }, [communityId]);

  const handleVote = async (postId, type) => {
    try {
      const endpoint = type === "up" ? "upvote" : "downvote";
      await api.put(`/posts/${postId}/${endpoint}`);
      const res = await api.get(`/communities/${communityId}`);
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  if (!community) return <p>Loading community...</p>;

  return (
    <div>
      <h2>r/{community.name}</h2>
      {community.description && <p>{community.description}</p>}
      <hr />
      {posts.map((p) => (
        <PostCard
          key={p._id}
          post={p}
          onUpvote={() => handleVote(p._id, "up")}
          onDownvote={() => handleVote(p._id, "down")}
        />
      ))}
    </div>
  );
}

export default CommunityPage;

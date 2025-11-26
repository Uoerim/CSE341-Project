import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import HomeFeed from "./pages/HomeFeed";
import CommunityPage from "./pages/CommunityPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";

// auth pages in /pages/Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/r/:communityId" element={<CommunityPage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/user/:userId" element={<ProfilePage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Layout>
  );
}

export default App;

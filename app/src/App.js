import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import HomeFeed from "./pages/HomeFeed";
import CommunityPage from "./pages/CommunityPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import PopularPage from "./pages/PopularPage";

// auth pages in /pages/Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import SettingsPage from "./pages/SettingPage";
import Auth from "./pages/Auth/Auth";



function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/popular" element={<PopularPage />} />
        <Route path="/r/:communityId" element={<CommunityPage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/user/:userId" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Auth />} />
      </Routes>
    </Layout>
  );
}

export default App;

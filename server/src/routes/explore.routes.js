import express from "express";
import {
  communities,
  posts,
  exploreSections,
} from "../utils/dummydataExplore.js";

const router = express.Router();

router.get("/communities", (req, res) => {
  res.json(communities);
});

router.get("/posts", (req, res) => {
  const { sort = "hot", page = 1, limit = 10 } = req.query;
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);

  let sortedPosts = [...posts];
  if (sort === "hot") sortedPosts.sort((a, b) => b.upvotes - a.upvotes);
  else if (sort === "new")
    sortedPosts.sort((a, b) => b.createdAt - a.createdAt);
  else if (sort === "top") sortedPosts.sort((a, b) => b.upvotes - a.upvotes);

  res.json(sortedPosts.slice(start, end));
});


router.get("/sections/:tab", (req, res) => {
  const tab = req.params.tab.toLowerCase();
  res.json(exploreSections[tab] || exploreSections.all);
});

export default router;

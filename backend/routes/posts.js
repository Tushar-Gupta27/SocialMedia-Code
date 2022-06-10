import express from "express";
// doing this controller to create all logic in separate file and keep rest of routes in a readable manner
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  searchPosts,
  getPost,
  commentPost,
} from "../controllers/postsController.js";
import auth from "../middleware/auth.js";
const router = express.Router();

//whenever we need authentication of user, we add middleware
// if /:id is above /s it considers it in /:id where id=s and thus doesnt work
router.get("/s", searchPosts);
router.get("/:id", getPost);
router.get("/", getPosts);
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);
router.post("/:id/commentPost", auth, commentPost);
export default router;

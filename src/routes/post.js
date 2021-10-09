const {
  getPosts,
  createPost,
  postsByUser,
  postsById,
  deletePost,
  isPoster,
  updatePost,
  photo,
  singlePost,
  like,
  unlike,
  comment,
  uncomment,
} = require("../controllers/post");
const { userById } = require("../controllers/user");

const express = require("express");
const { createPostValidator } = require("../helpers/index");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.get("/posts", getPosts);
//like unlike
router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unlike);
router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);
router.post(
  "/post/new/:userId",
  requireSignin,
  createPost,
  createPostValidator
);
router.get("/posts/by/:userId", requireSignin, postsByUser);
router.get("/post/:postId", singlePost);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);

//photo2
router.get("/post/photo/:postId", photo);

//any route containing :userId, our app will first execute UserById()
router.param("userId", userById);
//same with any route containing :postId
router.param("postId", postsById);

module.exports = router;

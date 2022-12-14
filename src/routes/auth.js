const {
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");

const express = require("express");
const {
  userSignupValidator,
  passwordResetValidator,
} = require("../helpers/index");
//const validator = require('../helpers/index')

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);

//any route containing userId, our app will first execute UserById()
router.param("userId", userById);

module.exports = router;

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { sendEmail } = require("../helpers/index");
// load env
const dotenv = require("dotenv");
dotenv.config();
require("dotenv").config();

const signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  //use conditional programming like above to restrict messages
  //from guys, if u are a lesbian woman (for example)
  //const userLesbian = await User.findOne({sexpref: woman})

  if (userExists)
    return res.status(403).json({
      error: "Email is taken!",
    });
  const user = await new User(req.body);
  await user.save();
  //  db.user.save()
  res.status(200).json({ message: "Signup success! Please login" });
};

const signin = (req, res) => {
  //find user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email doesn't exist. Please signin.",
      });
    }
    //if user is found make sure email and password are correct
    //create authenticate method in model and use here
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    //created token above
    res.cookie("t", token, { expire: new Date() + 9999 });

    const { _id, name, email } = user;
    return res.json({ token, user: { _id, email, name } });
  });

  //if error or no user

  //if user is found, then authenticate them

  //generate a token with user id and secret

  //persist the token as t in cookie with expiry date

  //return respone with user and token to frontend client
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "Signout success!" });
};

const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  // userProperty: "auth"
});

// add forgotPassword and resetPassword methods
const forgotPassword = (req, res) => {
  if (!req.body) return res.status(400).json({ message: "No request body" });
  if (!req.body.email)
    return res.status(400).json({ message: "No Email in request body" });

  console.log("forgot password finding user with that email");
  const { email } = req.body;
  console.log("signin req.body", email);
  // find the user based on email
  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status("401").json({
        error: "User with that email does not exist!",
      });

    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: "NODEAPI" },
      process.env.JWT_SECRET
    );

    // email data
    const emailData = {
      from: "noreply@node-react.com",
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ message: err });
      } else {
        sendEmail(emailData);
        return res.status(200).json({
          message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
        });
      }
    });
  });
};

const resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  User.findOne({ resetPasswordLink }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status("401").json({
        error: "Invalid Link!",
      });

    const updatedFields = {
      password: newPassword,
      resetPasswordLink: "",
    };

    user = _.extend(user, updatedFields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: `Great! Now you can login with your new password.`,
      });
    });
  });
};

module.exports = {
  signup,
  signin,
  signout,
  requireSignin,
  forgotPassword,
  resetPassword,
};

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
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

module.exports = {
  signup,
  signin,
  signout,
  requireSignin,
};

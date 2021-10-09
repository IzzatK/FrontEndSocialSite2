const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

const postsById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name")
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: err,
        });
      }
      req.post = post;
      next();
    });
};

const getPosts = (req, res) => {
  const posts = Post.find()
    .populate("postedBy", "_id name")
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name")
    .select("__id title body created likes ")
    .sort({ created: -1 })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => console.log(err));
};

const postsByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name")
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name")
    .select("__id title body created likes ")
    .sort("_created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(posts);
    });
};
const createPost = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image couldn't be uploaded properly",
      });
    }
    let post = new Post(fields);
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    post.postedBy = req.profile;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error saving",
        });
      }
      res.json(result);
    });
  });
};

const getUserId = (req, res, post) => {
  let idofUser = User.findOne(req.profile._id);
  return idofUser;
};
//simple boolean JS method below
const isPoster = (req, res, next) => {
  const userId = getUserId;
  console.log(userId);
  let isPoster = (req.post.postedBy._id = userId);
  // let isPoster = req.post && req.auth && req.post.postedBy._id === req.auth._id;
  //create a method to get userId, then compare its variable to post.postedBy._id as above
  //to create a boolean isPoster as shown above
  // let isPoster = req.profile._id == post.postedBy._id;
  console.log("req.post", req.post);
  console.log("req.auth", req.auth);
  console.log("req.post.posteedBy._id:", req.post.postedBy._id);
  console.log("req.auth._id", req.auth._id);

  if (!isPoster) {
    return res.status(403).json({
      error: "User isn't authorized!",
    });
  }
  next();
};
//postsById method runs whenever the req.post is called
const deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "Post deleted successfully!",
    });
  });
};

const updatePost = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Photo couldnt be uploaded" });
    }

    let post = req.post;
    post = _.extend(post, fields);
    post.updated = Date.now();

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }

    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(post);
    });
  });
};

// const updatePost = (req, res, next) => {
//     let post = req.post;
//     post = _.extend(post, req.body);
//     post.updated = Date.now();
//     post.save(err => {
//         if(err) {
//             return res.status(400),json({
//                 error: err
//             })
//         }
//         res.json(post);
//     })

// }

const photo = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

const singlePost = (req, res) => {
  return res.json(req.post);
};
const like = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json;
    } else {
      res.json(result);
    }
  });
};

const unlike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json;
    } else {
      res.json(result);
    }
  });
};

const comment = (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;

  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: req.body.userId } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json;
      } else {
        res.json(result);
      }
    });
};

const uncomment = (req, res) => {
  let comment = req.body.comment;

  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { comments: { _id: comment._id } } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json;
      } else {
        res.json(result);
      }
    });
};

module.exports = {
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
};

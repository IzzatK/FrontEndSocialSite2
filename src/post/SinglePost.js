import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import DefaultPost from "../imgs/punjabvalley.jpg";
import LikeButton from "../imgs/likebutton2.png";
import DislikeButton from "../imgs/dislikebutton2.png";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/index";
import Comment from "./Comment";
//conditional Boolean rendering is shown in in this Componenent and many others in the project
class SinglePost extends Component {
  state = {
    post: "",
    redirectToHome: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: [],
  };

  checkLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
        });
      }
    });
  };

  updateComments = (comments) => {
    this.setState({ comments });
  };

  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
      return false; //return false will create a funcn break
    }
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    // const postId = this.props.match.params.postId;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;

    callApi(userId, token, postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length,
        });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your post?");
    if (answer) {
      this.deletePost();
    }
  };

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  renderPost = (post) => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : " Unknown";

    const { like, likes } = this.state;

    return (
      <div className="card col-md-10 col-sm-10 col-10 offset-1">
        <div className="card-body">
          <img
            src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
            alt={post.title}
            onError={(i) => (i.target.src = `${DefaultPost}`)}
            className=" mb-3"
            style={{ height: "300px", width: "100%" }}
          />
          {like ? (
            <img
              onClick={this.likeToggle}
              style={{ width: "12%", height: "auto" }}
              src={DislikeButton}
            />
          ) : (
            <img
              onClick={this.likeToggle}
              style={{ width: "12%", height: "auto" }}
              src={LikeButton}
            />
          )}
          <h3 className="text-center">{likes} Likes</h3>
          <p className="card-text text-center">{post.body}</p>
          <br />
          <p className="font-italic mark">
            Posted by <Link to={`${posterId}`}>{posterName} </Link>
            on {new Date(post.created).toDateString()}
          </p>
          <div className="d-inline-block">
            <Link to={`/`} className="btn btn-raised btn-primary btn-sm mr-5">
              Back to posts
            </Link>
            {isAuthenticated().user &&
              isAuthenticated().user._id === post.postedBy._id && (
                <>
                  <Link
                    to={`/post/edit/${post._id}`}
                    className="btn btn-raised btn-warning btn-sm mr-5"
                  >
                    Update Post
                  </Link>
                  <button
                    onClick={this.deleteConfirmed}
                    className="btn btn-raised btn-warning"
                  >
                    Delete Post
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { post, redirectToHome, redirectToSignin, comments } = this.state;
    if (this.state.redirectToHome) {
      return <Redirect to={`/`} />;
    }
    if (this.state.redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }
    return (
      <div>
        <h2 className="display-2 mt-5 mb-5">{post.title}</h2>
        {!post ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}
        <Comment
          postId={post._id}
          comments={comments}
          updateComments={this.updateComments}
        />
      </div>
    );
  }
}
export default SinglePost;

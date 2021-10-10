import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth/index";
import { Link } from "react-router-dom";
import DefaultProfile from "../imgs/useravatar.png";

class Comment extends Component {
  state = {
    text: "",
    error: "",
  };

  handleChange = (event) => {
    this.setState({ error: "" });
    this.setState({ text: event.target.value });
  };

  deleteConfirmed = (comment) => {
    let answer = window.confirm(
      "Are you sure you want to delete your comment?"
    );
    if (answer) {
      this.deleteComment(comment);
    }
  };

  deleteComment = (comment) => {
    const userId = isAuthenticated().user._id;
    const postId = this.props.postId;
    const token = isAuthenticated().token;

    uncomment(userId, token, postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        //dispatch fresh list to parent {SinglePost}
        this.props.updateComments(data.comments);
      }
    });
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.length > 150) {
      this.setState({
        error: "Comment should not be empty, and less than 150 characters",
      });
      return false;
    }
    return true;
  };

  addComment = (event) => {
    event.preventDefault();
    if (!isAuthenticated()) {
      this.setState({ error: "Please sign in to leave a comment" });
      return false;
    }
    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const postId = this.props.postId;
      const token = isAuthenticated().token;

      comment(userId, token, postId, { text: this.state.text }).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: "" });

          //dispatch fresh list to parent {SinglePost}
          this.props.updateComments(data.comments);
        }
      });
    }
  };

  render() {
    const { comments } = this.props;
    const { error } = this.state;
    return (
      <div>
        <h2 className="mt-3 mb-3 ml-3">Leave a Comment</h2>

        <form>
          <div className="form-group">
            <input
              type="text"
              style={{ width: "65%" }}
              className="form-control ml-3"
              onChange={this.handleChange}
              value={this.state.text}
            />
            <button
              onClick={this.addComment}
              className="btn btn-raised btn-success ml-3 mt-3"
            >
              Post comment
            </button>
          </div>
        </form>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>
        {/* {JSON.stringify(comments)} */}
        <hr />
        <div className="col-md-12 col-md-offset-2">
          <h2 className="text-primary">
            {comments.length} {""}Comments
          </h2>
          <hr />
          {comments.map((comment, i) => {
            return (
              <div key={i}>
                <div>
                  <Link to={`/user/${comment.postedBy._id}`}>
                    <img
                      style={{ borderRadius: "50%", border: "1px solid black" }}
                      className="float-left mr-2"
                      height="30px"
                      width="30px"
                      src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                      onError={(i) => (i.target.src = `${DefaultProfile}`)}
                      alt={comment.postedBy.name}
                    />
                  </Link>
                  <div>
                    <p className="lead">{comment.text}</p>
                    <br />
                    <p className="font-italic mark mb-5">
                      Commented by{" "}
                      <Link to={`/user/${comment.postedBy._id}`}>
                        {comment.postedBy.name}{" "}
                      </Link>
                      on {new Date(comment.created).toDateString()}
                      <span>
                        {isAuthenticated().user &&
                          isAuthenticated().user._id ===
                            comment.postedBy._id && (
                            <>
                              <span
                                onClick={() => this.deleteConfirmed(comment)}
                                className="text-danger float-right mr-1"
                              >
                                Remove comment
                              </span>
                            </>
                          )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Comment;

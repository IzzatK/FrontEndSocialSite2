import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth/index";
import { Link } from "react-router-dom";

class Comment extends Component {
  state = {
    text: "",
  };

  handleChange = (event) => {
    this.setState({ text: event.target.value });
  };

  addComment = (event) => {
    event.preventDefault();
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
  };

  render() {
    return (
      <div>
        <h2 className="mt-3 mb-3 ml-3">Leave a Comment</h2>

        <form onSubmit={this.addComment}>
          <div className="form-group">
            <input
              type="text"
              style={{ width: "65%" }}
              className="form-control ml-3"
              onChange={this.handleChange}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default Comment;

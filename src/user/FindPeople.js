import React, { Component } from "react";
import user from "../models/user";
import DefaultProfile from "../imgs/useravatar.png";
import { findPeople } from "./apiUser";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/index";

class FindPeople extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    findPeople(userId, token).then((data) => {
      if (typeof data === "undefined" && data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }
  //users photo must be updated and changed accordingly
  //wrap the users.map in a return with {} surrounding, or with () surrounding and no return statement
  renderUsers = (users) => (
    <div className="row">
      {users.map((user, i) => (
        <div
          className="card col-md-3 col-xs-4 col-sm-4 offset-sm-1 offset-xs-1 col-xs-1"
          key={i}
          style={{ width: "75%" }}
        >
          <img
            style={{ height: "auto", width: "202px" }}
            className="img-thumbnail"
            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
            onError={(i) => (i.target.src = `${DefaultProfile}`)}
            alt={user.name}
          />
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{user.email}</p>
            <Link
              to={`/user/${user._id}`}
              className="btn btn-raised btn-primary btn-sm"
            >
              View Profile
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { users } = this.state;
    return (
      <div className="d-flex">
        <h2 className="mt-5 mb-5">Find People</h2>

        {this.renderUsers(users)}
      </div>
    );
  }
}

export default FindPeople;

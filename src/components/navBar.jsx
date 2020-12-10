import React, {Component} from "react";
import {NavLink, Link} from "react-router-dom";

class NavBar extends Component {
  state = {};

  render() {
    const {user} = this.props;
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          Avaamo
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard">
                Dashboard <span className="sr-only">(current)</span>
              </NavLink>
            </li>
            {!user && (
              <React.Fragment>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signin">
                    Sign In
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signup">
                    Sign Up
                  </NavLink>
                </li>
              </React.Fragment>
            )}
            {user && (
              <React.Fragment>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    {user.username}
                    {user.isAdmin ? (
                      <span className="badge badge-pill badge-danger">
                        Admin
                      </span>
                    ) : null}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/changepassword">
                    Change Password
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/logout">
                    Logout
                  </NavLink>
                </li>
              </React.Fragment>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavBar;

import React, {Component} from "react";
import "./App.css";
import {Switch, Route,Redirect} from "react-router-dom";
import SigninForm from "./components/signinForm";
import NavBar from "./components/navBar";
import Dashboard from './components/dashboard';
import SignupForm from './components/signupForm';

class App extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <NavBar/>
        <main className="container">
        <Switch>
          <Route path="/signin" component={SigninForm} />
          <Route path="/signup" component={SignupForm} />
          <Route path="/dashboard" component={Dashboard} />
          <Redirect exact path="/" to="/dashboard" />
        </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;

import React, {Component} from "react";
import "./App.css";
import {Switch, Route,Redirect} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SigninForm from "./components/signinForm";
import NavBar from "./components/navBar";
import Dashboard from './components/dashboard';
import SignupForm from './components/signupForm';
import Forgot from './components/forgotPassword';
import ResetPassword from './components/resetPassword';
import AskQuestion from './components/askQuestion';
import ProtectedRoute from './components/common/protectedRoute';
import ChangePassword from './components/changePassword';

class App extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <ToastContainer/>
        <NavBar/>
        <main className="container">
        <Switch>
          <Route path="/signin" component={SigninForm} />
          <Route path="/signup" component={SignupForm} />
          <Route exact path="/forgot" component={Forgot} />
          <Route path="/forgot/:id" component={ResetPassword}/>
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/ask/:id" component={AskQuestion} />
          <ProtectedRoute path="/changepassword" component={ChangePassword} />
          <Redirect exact path="/" to="/dashboard" />
        </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;

import React from "react";
import Joi from "joi";
import Form from "./common/form";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import {toast} from "react-toastify";

class LoginForm extends Form {
  state = {
    data: {
      userId: "",
      password: "",
    },
    errors: {},
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await auth.login(data.userId, data.password); 

      const {state}=this.props.location
      window.location=state?state.from.pathname:"/"
    } catch (ex) {
      if(ex.response&&ex.response.status===400){
        if (ex.response.data.property) {
          const errors = {...this.state.errors};
          errors[ex.response.data.property] = ex.response.data.msg;
          return this.setState({errors});
        }
        toast.error(ex.response.data);
      }
    }
  };
  
  schema = {
    userId: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password")
  };

  validateSchema = (data,options) => {
    let schema = Joi.object(this.schema);
    return schema.validate(data,options);
  };



  render() {
    if(auth.getCurrentUser()) return <Redirect to="/" />
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("userId", "Username or Email","username or email",null,true)}
          {this.renderInput("password", "Password", "password","password")}
          {this.renderButton("Login")}
          <br/><a href="/forgot">forgot password?</a>
        </form>
      </div>
    );
  }
}

export default LoginForm;

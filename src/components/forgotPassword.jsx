import React from "react";
import Joi from "joi";
import Form from "./common/form";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import { forgotPassword } from './../services/userService';
import { displayNotification } from './../services/notificationService';

class Forgot extends Form {
  state = {
    data: {
      userId: "",
    },
    errors: {},
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      const response=await forgotPassword(data.userId);
      displayNotification("info",response.data)
    } catch (ex) {
      if(ex.response&&ex.response.status===400){
        if (ex.response.data.property) {
          const errors = {...this.state.errors};
          errors[ex.response.data.property] = ex.response.data.msg;
          return this.setState({errors});
        }
        displayNotification("error",ex.response.data)
      }
    }
  };
  
  schema = {
    userId: Joi.string().required().label("Username or Email"),
  };

  validateSchema = (data,options) => {
    let schema = Joi.object(this.schema);
    return schema.validate(data,options);
  };



  render() {
    if(auth.getCurrentUser()) return <Redirect to="/" />
    return (
      <div>
        <h1>Forgot Password</h1>  
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("userId", "Username","username or email",null,true)}
          {this.renderButton("Send reset link")}
        </form>
      </div>
    );
  }
}

export default Forgot;

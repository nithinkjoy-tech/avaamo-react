import React from "react";
import Joi from "joi";
import Form from "./common/form";
import auth from "../services/authService";
import {register} from "../services/userService";

class RegisterForm extends Form {
  state = {
    data: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
    errors: {},
  };

  doSubmit = async () => {
    try {
      const response = await register(this.state.data);
      auth.loginWithJwt("token", response.headers["x-auth-token"]);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = {...this.state.errors};
        errors.username = ex.response.data;
        this.setState({errors});
      }
    }
  };


  schema = {
    name: Joi.string().min(2).max(50).required(),
    username: Joi.string()
      .min(1)
      .max(30)
      .required()
      .pattern(new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)),
    email: Joi.string()
      .required()
      .pattern(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
      .message("Email must be valid"),
    password: Joi.string().min(6).max(256).required(),
    confirmpassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .messages({"any.only": "passwords does not match"}),
  };

  validateUser = (data,options) => {
    let schema = Joi.object(this.schema);
    return schema.validate(data,options);
  };

  render() {
    return (
      <React.Fragment>
        <h1>Register</h1>
        <div>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Name",null,null,true)}
            {this.renderInput("username", "Username")}
            {this.renderInput("email", "Email")}
            {this.renderInput("password", "Password",null, "password")}
            {this.renderInput(
              "confirmpassword",
              "Confirm Password",
              null,
              "password"
            )}
            {this.renderButton("Register")}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default RegisterForm;

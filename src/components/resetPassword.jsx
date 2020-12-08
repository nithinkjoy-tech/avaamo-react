import React from "react";
import Joi from "joi";
import Form from "./common/form";
import auth from "../services/authService";
import {resetPassword} from "../services/userService";
import {Redirect} from "react-router-dom";
import {toast} from "react-toastify";

class ResetPassword extends Form {
  state = {
    data: {
      password: "",
      confirmpassword: "",
    },
    errors: {},
  };

  doSubmit = async () => {
    try {
      const {data} = this.state;
      await resetPassword(this.props.match.params.id, data);
      const {state} = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
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
    password: Joi.string().min(6).max(256).required(),
    confirmpassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .messages({"any.only": "passwords does not match"}),
  };

  validateSchema = (data, options) => {
    let schema = Joi.object(this.schema);
    return schema.validate(data, options);
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <div>
        <h1>Reset Password</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("password", "Password", "password", "password")}
          {this.renderInput(
            "confirmpassword",
            "Confirm Password",
            "confirm password",
            "password"
          )}
          {this.renderButton("Update password")}
        </form>
      </div>
    );
  }
}

export default ResetPassword;

import React from "react";
import Joi from "joi";
import Form from "./common/form";
import auth from "../services/authService";
import {toast} from "react-toastify";
import {changePassword} from "../services/userService";
import {Redirect} from "react-router-dom";

class ChangePassword extends Form {
  state = {
    data: {
      oldpassword: "",
      password: "",
      confirmpassword: "",
    },
    errors: {},
  };

  doSubmit = async () => {
    try {
      const response=await changePassword(this.state.data);
      toast.info(response.data.msg)
      auth.loginWithJwt(response.data.token)
        window.location="/"
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
    oldpassword: Joi.string().required(),
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
    if (!auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <React.Fragment>
        <h1>Change Password</h1>
        <div>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput(
              "oldpassword",
              "Old Password",
              null,
              "password",
              true
            )}
            {this.renderInput("password", "Password", null, "password")}
            {this.renderInput(
              "confirmpassword",
              "Confirm Password",
              null,
              "password"
            )}
            {this.renderButton("Change password")}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default ChangePassword;

import React from "react";
import Joi from "joi";
import Form from "./common/form";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";

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
      await auth.login(data.username, data.password);

      const {state}=this.props.location
      window.location=state?state.from.pathname:"/"
    } catch (ex) {
      if(ex.response&&ex.response.status===400){
        const errors={...this.state.errors}
        errors.username=ex.response.data
        this.setState({errors})
      }
    }
  };
  
  schema = {
    userId: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password")
  };

  validateUser = (data,options) => {
    let schema = Joi.object(this.schema);
    return schema.validate(data,options);
  };



  render() {
    if(auth.getCurrentUser()) return <Redirect to="/" />
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("userId", "Username","username or email",null,true)}
          {this.renderInput("password", "Password", "password","password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;

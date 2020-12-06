import React from "react";
import Joi from "joi";
import Form from "./common/form";
import auth from "../services/authService";
import {Redirect} from "react-router-dom";
import {toast} from "react-toastify";

class AskQuestion extends Form {
  state = {
    data: {
      question: "",
    },
    errors: {},
  };

  doSubmit = async () => {
    try {
      const {data} = this.state;
      await auth.login(data.username, data.password);

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
    question: Joi.string().required().label("Question"),
  };

  validateUser = (data, options) => {
    let schema = Joi.object(this.schema);
    return schema.validate(data, options);
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/signin" />;
    return (
      <div>
        <h1>Q/A</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("question", "Question", "question", null, true)}
          {this.renderButton("Ask")}
        </form>
      </div>
    );
  }
}

export default AskQuestion;

import React from "react";
import Joi from "joi";
import Form from "./common/form";
import auth from "../services/authService";
import {askQuestion} from "../services/scrapeService";
import {Redirect} from "react-router-dom";
import {toast} from "react-toastify";

class AskQuestion extends Form {
  state = {
    data: {
      question: "",
    },
    answer: "",
    errors: {},
  };

  doSubmit = async () => {
    try {
      const {data} = this.state;
      const response = await askQuestion(
        this.props.match.params.id,
        data.question
      );
      this.setState({answer:response.data});
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

  validateSchema = (data, options) => {
    let schema = Joi.object(this.schema);
    return schema.validate(data, options);
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/signin" />;
    return (
      <React.Fragment>
        <div>
          <h1>Q/A</h1>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("question", "Question", "question", null, true)}
            {this.renderButton("Ask")}
          </form>
        </div>
        <div>
          <h3>{this.state.answer}</h3>
        </div>
      </React.Fragment>
    );
  }
}

export default AskQuestion;

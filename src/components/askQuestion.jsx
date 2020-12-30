import React from "react";
import Joi from "joi";
import Form from "./common/form";
import auth from "../services/authService";
import {askQuestion} from "../services/scrapeService";
import {Redirect} from "react-router-dom";
import {toast} from "react-toastify";
import {getScrapedIdData} from "./../services/scrapeService";

class AskQuestion extends Form {
  state = {
    data: {
      scrapedDetails: "",
      question: "",
    },
    answer: "",
    errors: {},
  };

  async componentDidMount() {
    try {
      const {data: scrapedDetails} = await getScrapedIdData(
        this.props.match.params.id
      );
      let data = {...this.state.data};
      data["scrapedDetails"] = scrapedDetails;
      this.setState({data});
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
  }

  doSubmit = async () => {
    try {
      const {data} = this.state;
      const response = await askQuestion(
        this.props.match.params.id,
        data.question
      );
      this.setState({answer: response.data});
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
    console.log("ff", this.state.data.scrapedDetails);
    return (
      <React.Fragment>
        <div>
          <h1>Q/A</h1>
          <ul className="list-group clickable m-2">
            {Object.entries(this.state.data.scrapedDetails).map(
              ([key, value]) => (
                <li className="list-group-item" key={key}>
                  <b>{key}</b> :{value}
                </li>
              )
            )}
          </ul>
          {this.state.data.scrapedDetails["URL Link"] ? (
            <button
            
            className="btn btn-secondary sm">Scrape Again</button>
          ) : (
            ""
          )}
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

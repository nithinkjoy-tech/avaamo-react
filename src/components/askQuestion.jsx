import React from "react";
import Joi from "joi";
import Form from "./common/form";
import auth from "../services/authService";
import {askQuestion} from "../services/scrapeService";
import {Redirect} from "react-router-dom";
import {getScrapedIdData} from "./../services/scrapeService";
import {sendFileOrLink} from "../services/scrapeService";
import { displayNotification } from './../services/notificationService';

class AskQuestion extends Form {
  state = {
    buttonDisabled:false,
    data: {
      scrapedDetails: "",
      question: "",
    },
    answer: "",
    errors: {},
  };

  reScrape = async () => {
    try {
      this.setState({buttonDisabled:true})
      let uploadProgress = "";
      let dataToSend = {
        link: this.state.data.scrapedDetails["URL Link"],
        id: this.props.match.params.id,
      };
      const {data: scrapedDetails} = await sendFileOrLink(
        dataToSend,
        uploadProgress
      );
      let data = {...this.state.data};
      data["scrapedDetails"] = scrapedDetails;
      this.setState({buttonDisabled:false})
      displayNotification("success","Successfully re-scraped")
    } catch (ex) {
      if (
        ex.response &&
        ex.response.status >= 400 &&
        ex.response.status <= 500
      ) {
        if (ex.response.data.property) {
          const errors = {...this.state.errors};
          errors[ex.response.data.property] = ex.response.data.msg;
          return this.setState({errors});
        }
        // toast.warn(ex.response.data);
      }
    }
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
        displayNotification("error",ex.response.data)
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
        displayNotification("error",ex.response.data)
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
              disabled={this.state.buttonDisabled}
              onClick={this.reScrape}
              className="btn btn-secondary sm"
            >
              Scrape Again
            </button>
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

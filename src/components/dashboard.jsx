import React from "react";
import Form from "./common/form";
import auth from "../services/authService";
import Joi from "joi";
import {Redirect} from "react-router-dom";
import {getPreviousScrapedIds} from "../services/scrapeService";
import { toast } from 'react-toastify';
const item = ["aa", "bb", "cc", "dd"];

class Dashboard extends Form {
  state = {
    data: {
      htmllink: "",
      htmlfile: "",
    },
    errors: {},
  };

  async componentWillMount() {
    try {
      const {data} = await getPreviousScrapedIds();
      if(data.changepassword) return window.location="/changepassword"
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

  handleScrapeIdClick = item => {
    window.location = `/ask/${item}`;
  };

  doSubmit = async () => {
    try {
      const {data} = this.state;
      await auth.login(data.username, data.password);

      const {state} = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = {...this.state.errors};
        errors.username = ex.response.data;
        this.setState({errors});
      }
    }
  };

  schema = {
    htmllink: Joi.string().required().uri().label("HTML link"),
    htmlfile: Joi.string()
      .pattern(new RegExp(/.html$/))
      .message("only html file allowed"),
  };

  validateUser = (data, options) => {
    let schema = Joi.object(this.schema);
    return schema.validate(data, options);
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <div className="row">
        <div className="col-3">
          <ul className="list-group clickable m-2">
            {item.map(item => (
              <li
                className="list-group-item"
                style={{cursor: "pointer"}}
                onClick={() => this.handleScrapeIdClick(item)}
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="col">
          <h1>Dashboard</h1>

          <form onSubmit={this.handleSubmit}>
            {this.renderInput("htmllink", "html link", "html link", null, true)}
            <h3>Or</h3>
            {this.renderInput("htmlfile", "HTML File", "file", "file")}
            {this.renderButton("Upload")}
          </form>
        </div>
      </div>
    );
  }
}

export default Dashboard;

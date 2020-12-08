import React from "react";
import Form from "./common/form";
import auth from "../services/authService";
import Joi from "joi";
import {Redirect} from "react-router-dom";
import {getPreviousScrapedIds} from "../services/scrapeService";
import {toast} from "react-toastify";
const item = ["aa", "bb", "cc", "dd"];

class Dashboard extends Form {
  state = {
    dropdownList:["link","file"],
    dataSchemaValue:[Joi.string().required().uri().message("HTML link should be a valid link"),
              Joi.string().required().pattern(new RegExp(/.html$/)).message("Uploaded file must be a HTML file")],
    data: {
      type:"",
      data:""
    },
    errors: {},
  };

  async componentWillMount() {
    try {
      const {data} = await getPreviousScrapedIds();
      if (data.changepassword) return (window.location = "/changepassword");
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
    type: Joi.string().label("Dropdown List"),
    data: null,
  };

  validateSchema = (data, options) => {
    let schema = Joi.object(this.schema);
    return schema.validate(data, options);
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/" />;
    let {type}=this.state.data
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
            {this.renderSelect("type", "Select type", this.state.dropdownList)}
            {this.renderInput("data", type, type, type, true,!this.state.data.type)}
            {this.renderButton("Upload")}
          </form>
        </div>
      </div>
    );
  }
}

export default Dashboard;

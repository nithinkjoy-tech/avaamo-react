import React from "react";
import Form from "./common/form";
import auth from "../services/authService";
import Joi from "joi";
import {Redirect} from "react-router-dom";
import {getPreviousScrapedIds} from "../services/scrapeService";
import {toast} from "react-toastify";
import {sendFileOrLink} from "../services/scrapeService";
import ReactLoading from "react-loading";
import {Progress} from "reactstrap";
const item = ["aa", "bb", "cc", "dd"];

class Dashboard extends Form {
  state = {
    isLoading: false,
    isUploading: false,
    dropdownList: ["link", "file"],
    dataSchemaValue: [
      Joi.string().required().uri().message("HTML link should be a valid link"),
      Joi.string()
        .required()
        .pattern(new RegExp(/.html$/))
        .message("Uploaded file must be a HTML file"),
    ],
    uploadedFile: "",
    loaded: 0,
    data: {
      type: "",
      data: "",
    },
    errors: {},
  };

  async componentDidMount() {
    try {
      // const {data} = await getPreviousScrapedIds();
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

  componentDidUpdate() {
    if (this.state.isLoading === true) return;
    if (this.state.loaded === 100) {
      this.setState({isUploading: false, isLoading: true});
    }
  }

  handleScrapeIdClick = item => {
    window.location = `/ask/${item}`;
  };

  doSubmit = async () => {
    try {
      if (this.state.isUploading === true) return;

      let {type} = this.state.data;
      let data;
      if (type === "link") {
        data = {link: this.state.data.data};
      } else {
        data = new FormData();
        data.append("file", this.state.uploadedFile);
        this.setState({isUploading: true, isLoading: false});
      }

      let uploadProgress = {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
          });
        },
      };

      const scrapeId = await sendFileOrLink(data, uploadProgress);
      window.location = `/ask/${scrapeId}`;
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
    type: Joi.string().label("Dropdown List"),
    data: null,
  };

  validateSchema = (data, options) => {
    let schema = Joi.object(this.schema);
    return schema.validate(data, options);
  };

  render() {
    let color = Math.random().toString(16).substring(3, 9);
    if (!auth.getCurrentUser()) return <Redirect to="/" />;
    if (auth.getCurrentUser().changepassword) return window.location="/changepassword"
    if (this.state.isLoading)
      return (
        <center>
          <ReactLoading
            type={"bars"}
            color={`#${color}`}
            height={"10%"}
            width={"50%"}
          />
        </center>
      );

    let {type} = this.state.data;
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
            {this.renderSelect(
              "type",
              "Select input type",
              this.state.dropdownList
            )}
            {this.renderInput(
              "data",
              type,
              type,
              type,
              true,
              !this.state.data.type
            )}
            {this.renderButton("Upload")}
          </form>
          <div className="form-group">
            <br />
            {this.state.isUploading ? (
              <Progress max="100" color="success" value={this.state.loaded}>
                {Math.round(this.state.loaded, 2)}%
              </Progress>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;

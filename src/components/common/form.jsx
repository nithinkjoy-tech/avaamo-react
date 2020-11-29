import React, {Component} from "react";
import Joi from "joi";
import Input from "./input";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = {abortEarly: false};
    let {error} = this.validateUser(this.state.data, options);

    if (!error) return "";

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({name, value}) => {
    let obj = {[name]: value};
    const schema = Joi.object({[name]: this.schema[name]});
    const {error} = schema.validate(obj);
    return error ? error.details[0].message : "";
  };

  validatePassword = (data, errors) => {
    if (data["password"] === data["confirmpassword"]) {
      delete errors["password"];
      delete errors["confirmpassword"];
    } else {
      errors["confirmpassword"] = "passwords doesn't match";
    }
    this.setState({data, errors: errors || {}});
  };

  handleSubmit = e => {
    e.preventDefault();
    let errors = this.validate();
    this.setState({errors});
    if (errors) return;
    this.doSubmit();
  };

  handleChange = ({currentTarget: input}) => {
    const errors = {...this.state.errors};
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = {...this.state.data};
    data[input.name] = input.value;
    this.validatePassword(data, errors);
  };

  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderInput(name, label, type = "text") {
    let {data, errors} = this.state;
    let autocomplete = false;
    if (type === "password") {
      autocomplete = true;
    }
    return (
      <Input
        type={type}
        name={name}
        onChange={this.handleChange}
        label={label}
        autoComplete={autocomplete.toString()}
        value={data[name]}
        autoFocus={name === "name" ? true : false}
        error={errors[name]}
      />
    );
  }
}

export default Form;

import React, {Component} from "react";
import Joi from "joi";
import Input from "./input";
import Select from "./select";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = {abortEarly: false};
    let {error} = this.validateSchema(this.state.data, options);

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
    } else if (data["confirmpassword"]) {
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

  dashboardValidation=(input)=>{
    if(input.name==="type"){
      let {data}=this.state
      data.data=""
      let errors={}
      this.setState({data,errors})
    }
    
      if(this.state.data.type==="link"){
        this.schema.data=this.state.dataSchemaValue[0]
      }else{
        this.schema.data=this.state.dataSchemaValue[1]
      }
  }

  handleChange = ({currentTarget: input}) => {
    if(this.constructor.name==="Dashboard"){
      this.dashboardValidation(input)
    }

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

  renderSelect(name, label, options) {
    const {data, errors} = this.state;

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderInput(name, label, placeholder,type = "text",autofocus,disabled=false) {
    let {data, errors} = this.state;
    let autocomplete = false;
    if (type === "password") {
      autocomplete = true;
    }
    return (
      <Input
        type={type}
        placeholder={placeholder||name}
        name={name}
        onChange={this.handleChange}
        label={label}
        disabled={disabled}
        autoComplete={autocomplete.toString()}
        value={data[name]}
        autoFocus={autofocus}
        error={errors[name]}
      />
    );
  }
}

export default Form;

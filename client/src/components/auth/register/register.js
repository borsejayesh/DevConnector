import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAlert } from "../../../redux/alertReducer/alert.actions";

const Register = () => {
  let dispatch = useDispatch();

  let [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  let { name, email, password, cpassword } = formData;

  let handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  let handleSubmit = (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      dispatch(setAlert("Password Not Match", "danger"));
    } else {
      dispatch(setAlert("Registration SuccessFull", "success"));
      console.log(formData);
    }
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fa fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={name}
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Name"
            required
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            value={email}
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <input
            value={password}
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            value={cpassword}
            onChange={handleChange}
            type="password"
            name="cpassword"
            placeholder="ConfirmPassword"
            required
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already Have An Account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

export default Register;

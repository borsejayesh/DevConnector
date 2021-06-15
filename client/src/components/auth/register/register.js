import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fa fa-user"></i> Create Your Account
      </p>
      <form className="form">
        <div className="form-group">
          <input type="text" name="name" placeholder="Name" required />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input type="email" name="email" placeholder="Email" required />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="Cpassword"
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

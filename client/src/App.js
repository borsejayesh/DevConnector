import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./components/layout/navbar/Navbar";
import Landing from "./components/layout/landing-page/Landing";
import Register from "./components/auth/register/register";
import login from "./components/auth/login/login";

import "./App.css";

const App = () => {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={login} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
};

export default App;

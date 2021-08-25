import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TopMenu from "./components/TopMenu"
import HomePage from "./components/HomePage"
import Login from "./components/Authentication/Login"
import "./App.css";

function App() {
  return (
    <Router>
      <TopMenu />
      <Switch>
        <Route path="/" component={HomePage} exact />
        <Route path="/login" component={Login} exact />
      </Switch>
    </Router>

  );
}

export default App;

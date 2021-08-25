import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TopMenu from "./components/TopMenu";
import HomePage from "./components/HomePage";
import Login from "./components/Authentication/Login";
import Sidebar from "./components/Sidebar";
import BrowseCoursePage from "./components/BrowseCourse/BrowseCoursePage"
import CoursePreviewPage from "./components/BrowseCourse/CoursePreviewPage"
import ScrollToTop from "./components/ScrollToTop";


import "./App.css";

const App = () => {
  return (
    <Router>
      <TopMenu />
      <Sidebar />
      <Switch>
        <Route path="/" component={HomePage} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/browsecourse" component={BrowseCoursePage} exact />
        <Route path="/browsecourse/preview" component={CoursePreviewPage} exact />
      </Switch>
    </Router>

  );
}

export default App;

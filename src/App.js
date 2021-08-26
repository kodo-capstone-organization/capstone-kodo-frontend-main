import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TopMenu from "./components/TopMenu";
import HomePage from "./components/HomePage";
import Login from "./components/Authentication/Login";
import Sidebar from "./components/Sidebar";
import BrowseCoursePage from "./components/BrowseCourse/BrowseCoursePage"
import CoursePreviewPage from "./components/BrowseCourse/CoursePreviewPage"
import ProgressPage from "./components/ProgressPage"
import ProfilePage from "./components/MyProfile/ProfilePage"
import Setting from "./components/MyProfile/Setting"
import SessionPage from "./components/Sessions/SessionPage"
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
        <Route path="/progresspage" component={ProgressPage} exact />
        <Route path="/profile" component={ProfilePage} exact />
        <Route path="/profile/setting" component={Setting} exact />
        <Route path="/session" component={SessionPage} exact />
      </Switch>
    </Router>

  );
}

export default App;

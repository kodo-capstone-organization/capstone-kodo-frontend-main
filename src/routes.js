import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Redirect } from "react-router"

// Pages without sidebar
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

import Layout from "./components/Layout";
import { RouteItemsWithSidebar } from "./routeItems";
import Login from "./pages/Authentication/Login";
import SignUp from "./pages/Authentication/SignUp";
import CourseBuilderPage from "./pages/CourseBuilderPage";
import QuizBuidlerPage from "./pages/QuizBuilderPage";


import CourseOverview from "./pages/CourseViewer";
import LessonViewerWithRouter from "./pages/CourseViewer/LessonViewer";
import MultimediaViewerWithRouter from "./pages/CourseViewer/MultimediaViewer";

function Routes() {
    return (
        <BrowserRouter>
            <Route render={(props) => (
                <Layout {...props}>
                    <Switch>
                        <Route path="/" component={HomePage} exact >
                            {window.sessionStorage.getItem("loggedInAccountId") ? <Redirect to="/progresspage" /> : <HomePage />}
                        </Route>
                        <Route path="/login" component={Login} exact />
                        <Route path="/signup" component={SignUp} exact />
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/builder/:courseId" component={CourseBuilderPage} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/buildquiz/:contentId" component={QuizBuidlerPage} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/:courseId" component={CourseOverview} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/lesson/:courseId/:lessonId" component={LessonViewerWithRouter} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/lesson/:courseId/:lessonId/:contentId" component={MultimediaViewerWithRouter} exact />
                            : <Redirect to="/" />}
                        {
                            RouteItemsWithSidebar.map(item => {
                                return (
                                    window.sessionStorage.getItem("loggedInAccountId") ?
                                        <Route key={item.path} path={item.path} component={item.component} exact />
                                        : <Redirect to="/" />

                                );
                            })
                        }
                        <Route component={NotFound} />
                    </Switch>
                </Layout>
            )} />
        </BrowserRouter>
    )
}

export default Routes;
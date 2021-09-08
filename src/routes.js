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

import CourseOverview from "./pages/CourseViewer";
import LessonViewerWithRouter from "./pages/CourseViewer/LessonViewer";


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
                        <Route path="/builder/:courseId" component={CourseBuilderPage} exact />
                        <Route path="/overview/:courseId" component={CourseOverview} exact />
                        <Route path="/overview/lesson/:lessonId" component={LessonViewerWithRouter} exact />
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
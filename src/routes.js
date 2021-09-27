import React, {useState} from "react";
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

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import Alert from '@material-ui/lab/Alert';
import { severityList } from './values/Colours';

function Routes() {

    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false); // TODO: set to false
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackBarSeverity, setSnackBarSeverity] = useState("info"); // error, warning, info, success ONLY

    // To be propped into children components for them to call
    const callOpenSnackBar = (messageFromCaller: string, severityFromCaller: string) => {

        if (!severityList.includes(severityFromCaller)) { // invalid severity received, default to info
            severityFromCaller = "info"
        }

        // Set snackbar fields
        setSnackBarSeverity(severityFromCaller);
        setSnackBarMessage(messageFromCaller)

        // Finally, show the snackbar
        setIsSnackBarOpen(true)
    }

    const handleCloseSnackBar = () => {
        setIsSnackBarOpen(false)
        setSnackBarMessage("")
        setSnackBarSeverity("")
    }

    return (
        <BrowserRouter>
            <Route render={(props) => (
                <Layout {...props}>
                    {/*
                        Top level snackbar. Function to invoke the display are propped into
                        routes' main components as 'callOpenSnackBar'.
                    */}
                    <Snackbar
                        id="kodo-snackbar"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        open={isSnackBarOpen}
                        onClose={handleCloseSnackBar}
                        autoHideDuration={5000}
                        TransitionComponent={transitionProps => <Slide {...transitionProps} direction="left" />}
                    >
                        <Alert onClose={handleCloseSnackBar} severity={snackBarSeverity}>
                            {snackBarMessage}
                        </Alert>
                    </Snackbar>

                    {/* Route Switch */}
                    <Switch>
                        <Route path="/" component={HomePage} exact >
                            {window.sessionStorage.getItem("loggedInAccountId") ? <Redirect to="/progresspage" /> : <HomePage />}
                        </Route>
                        <Route path="/login" component={Login} exact />
                        <Route path="/signup" component={SignUp} exact />
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/builder/:courseId" render={props => <CourseBuilderPage {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/buildquiz/:contentId" render={props => <QuizBuidlerPage {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/:courseId" render={props => <CourseOverview {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/lesson/:courseId/:lessonId" render={props => <LessonViewerWithRouter {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/lesson/:courseId/:lessonId/:contentId" render={props => <MultimediaViewerWithRouter {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}
                        {
                            RouteItemsWithSidebar.map(item => {
                                return (
                                    window.sessionStorage.getItem("loggedInAccountId") ?
                                        <Route key={item.path} path={item.path} render={props => React.createElement(item.component, {...props, callOpenSnackBar: callOpenSnackBar})} exact />
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
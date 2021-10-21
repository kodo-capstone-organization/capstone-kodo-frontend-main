import React, { useState } from "react";
import {BrowserRouter, Route, Switch, useHistory} from "react-router-dom";
import { Redirect } from "react-router"

// Pages without sidebar
import HomePage from "./pages/HomePage";
import InvalidPage from "./pages/InvalidPage/InvalidPage";

import Layout from "./components/Layout";
import { RouteItemsWithSidebar } from "./routeItems";
import Login from "./pages/Authentication/Login";
import SignUp from "./pages/Authentication/SignUp";
import CourseBuilderPage from "./pages/CourseBuilderPage";
import QuizBuidlerPage from "./pages/QuizBuilderPage";

import CourseOverview from "./pages/CourseViewer";
import LessonViewerWithRouter from "./pages/CourseViewer/LessonViewer";
import LessonStatisticsViewerWithRouter from "./pages/CourseViewer/LessonStatisticsViewer";
import MultimediaViewerWithRouter from "./pages/CourseViewer/MultimediaViewer";
import QuizViewer from "./pages/QuizViewer";
import LiveKodoSessionPage from "./pages/Sessions/LiveKodoSessionPage";
import InvalidSessionPage from "./pages/Sessions/InvalidSessionPage";
import ProgressPage from "./pages/ProgressPage";

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import Alert from '@material-ui/lab/Alert';
import { severityList } from './values/Colours';
import ForumPage from "./pages/ForumPage";

function Routes() {

    const aes256 = require('aes256');
    const encryptionKey = 'kodokey123456789'

    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackBarSeverity, setSnackBarSeverity] = useState("info");

    const history = useHistory();

    // To be propped into children components for them to call
    const callOpenSnackBar = (messageFromCaller, severityFromCaller) => {
        // severityList: error, warning, info, success ONLY
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

    function encrypt(input) {
        return input ? aes256.encrypt(encryptionKey, String(input)) : null;
    }

    function decrypt(input) {
        return input ? aes256.decrypt(encryptionKey, String(input)) : null;
    }

    function getLoggedInAccountId() {
        try {
            let loggedInAccountId = window.sessionStorage.getItem("loggedInAccountId");
            if (loggedInAccountId) {
                loggedInAccountId = decrypt(loggedInAccountId);
                loggedInAccountId = parseInt(loggedInAccountId);
                return loggedInAccountId;
            }
            else
            {
                return null;
            }
        }catch(err){
            window.sessionStorage.removeItem("loggedInAccountId");
            window.sessionStorage.removeItem("loggedInAccountUsername");
            window.sessionStorage.removeItem("loggedInAccountPassword");
        }
    }

    return (
        <BrowserRouter>
            <Route render={(props) => (
                <Layout {...props}>
                    {/*
                        Top level snackbar. Function to invoke the display are propped into
                        routes' main components as 'callOpenSnackBar'.
                    */}
                    {isSnackBarOpen &&
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
                        </Snackbar>}

                    {/* Route Switch */}
                    <Switch>
                        <Route path="/" component={HomePage} exact >
                            {
                                window.sessionStorage.getItem("loggedInAccountId")
                                    ? <Redirect to="/progresspage" />
                                    : <HomePage />
                            }
                        </Route>


                        <Route path="/login" render={props => <Login {...props} callOpenSnackBar={callOpenSnackBar} encrypt={encrypt} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                        <Route path="/signup" render={props => <SignUp {...props} callOpenSnackBar={callOpenSnackBar} encrypt={encrypt} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                        <Route path="/invalidpage" render={props => <InvalidPage {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />

                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/progresspage" render={props => <ProgressPage {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/builder/:courseId" render={props => <CourseBuilderPage {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/buildquiz/:contentId" render={props => <QuizBuidlerPage {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                            : <Redirect to="/" />}
                        
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:courseId" render={props => <CourseOverview {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:courseId/lessonstatistics/:lessonId" render={props => <LessonStatisticsViewerWithRouter {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                            : <Redirect to="/" />}
                        
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:enrolledCourseId/lesson/:enrolledLessonId" render={props => <LessonViewerWithRouter {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                            : <Redirect to="/" />}

                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:enrolledCourseId/lesson/:enrolledLessonId/multimedia/:enrolledContentId" render={props => <MultimediaViewerWithRouter {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                            : <Redirect to="/" />}                        

                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:enrolledCourseId/lesson/:enrolledLessonId/markedquizviewer/:studentAttemptId" render={props => <QuizViewer {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                            : <Redirect to="/" />}

                        {/* tutor view */}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:enrolledCourseId/lesson/:enrolledLessonId/attemptquizviewer/:enrolledContentId" render={props => <QuizViewer {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                            : <Redirect to="/" />}

                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:courseId/forum" render={props => <ForumPage {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:courseId/forum/category/:forumCategoryId" render={props => <ForumPage {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:courseId/forum/category/:forumCategoryId/thread/:forumThreadId" render={props => <ForumPage {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                            : <Redirect to="/" />}

                        {/* Session Pages */}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/session/:initAction/:sessionId" render={props => <LiveKodoSessionPage {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                            : <Redirect to="/" />}

                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/session/invalidSession" render={props => <InvalidSessionPage {...props} callOpenSnackBar={callOpenSnackBar} getLoggedInAccountId={getLoggedInAccountId} />} exact />
                            : <Redirect to="/" />}
                        
                        {
                            RouteItemsWithSidebar.map(item => {
                                return (
                                    window.sessionStorage.getItem("loggedInAccountId") ?
                                        <Route key={item.path} path={item.path} render={props => React.createElement(item.component, { ...props, callOpenSnackBar: callOpenSnackBar })} exact />
                                        : <Redirect to="/" />

                                );
                            })
                        }
                    </Switch>
                </Layout>
            )} />
        </BrowserRouter>
    )
}

export default Routes;
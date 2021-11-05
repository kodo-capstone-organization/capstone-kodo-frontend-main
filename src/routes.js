import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Redirect } from "react-router"

import Layout from "./components/Layout";
import { RouteItemsWithSidebar } from "./routeItems";

// Pages without sidebar
import CourseBuilderPage from "./pages/CourseBuilderPage";
import HomePage from "./pages/HomePage";
import InvalidPage from "./pages/InvalidPage/InvalidPage";
import LoginPage from "./pages/LoginPage";
import QuizBuidlerPage from "./pages/QuizBuilderPage";
import QuizViewer from "./pages/QuizViewerPage";
import SignUpPage from "./pages/SignUpPage";


// Pages with sidebar
import CourseOverview from "./pages/CourseViewerPage";
import ForumPage from "./pages/ForumPage";
import InvalidSessionPage from "./pages/SessionsPages/InvalidSessionPage";
import LessonStatisticsViewerWithRouter from "./pages/CourseViewerPage/TutorView/LessonViewer";
import LessonViewerWithRouter from "./pages/CourseViewerPage/StudentView/LessonViewer";
import LiveKodoSessionPage from "./pages/SessionsPages/LiveKodoSessionPage";
import MultimediaViewerWithRouter from "./pages/CourseViewerPage/StudentView/MultimediaViewer";

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import Alert from '@material-ui/lab/Alert';
import { severityList } from './values/Colours';

function Routes() {

    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackBarSeverity, setSnackBarSeverity] = useState("info");

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
                            {window.sessionStorage.getItem("loggedInAccountId") ? <Redirect to="/progresspage" /> : <HomePage />}
                        </Route>
                        <Route path="/login" render={props => <LoginPage {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                        <Route path="/signup" render={props => <SignUpPage {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                        <Route path="/invalidpage" render={props => <InvalidPage {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                        
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/builder/:courseId" render={props => <CourseBuilderPage {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/buildquiz/:contentId" render={props => <QuizBuidlerPage {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}
                        
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:courseId" render={props => <CourseOverview {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:courseId/lessonstatistics/:lessonId" render={props => <LessonStatisticsViewerWithRouter {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}
                        
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:enrolledCourseId/lesson/:enrolledLessonId" render={props => <LessonViewerWithRouter {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}

                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:enrolledCourseId/lesson/:enrolledLessonId/multimedia/:enrolledContentId" render={props => <MultimediaViewerWithRouter {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}                        

                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:enrolledCourseId/lesson/:enrolledLessonId/markedquizviewer/:studentAttemptId" render={props => <QuizViewer {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}

                        {/* tutor view */}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:enrolledCourseId/lesson/:enrolledLessonId/attemptquizviewer/:enrolledContentId" render={props => <QuizViewer {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}

                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:courseId/forum" render={props => <ForumPage {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:courseId/forum/category/:forumCategoryId" render={props => <ForumPage {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/overview/course/:courseId/forum/category/:forumCategoryId/thread/:forumThreadId" render={props => <ForumPage {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}

                        {/* Session Pages */}
                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/session/:initAction/:sessionId" render={props => <LiveKodoSessionPage {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
                            : <Redirect to="/" />}

                        {window.sessionStorage.getItem("loggedInAccountId") ?
                            <Route path="/session/invalidSession" render={props => <InvalidSessionPage {...props} callOpenSnackBar={callOpenSnackBar} />} exact />
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
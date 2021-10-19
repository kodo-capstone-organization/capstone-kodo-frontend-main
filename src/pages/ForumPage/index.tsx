import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import {
    Breadcrumbs, Link
} from '@material-ui/core';

import { getForumThreadByForumThreadId, getForumCategoryByForumCategoryId, getAllForumCategoriesByCourseId } from "../../apis/Forum/ForumApis";
import { isStudentByCourseIdAndAccountId } from "../../apis/Course/CourseApis";
import { isTutorByCourseIdAndAccountId } from "../../apis/Course/CourseApis";

import { ForumCategory } from '../../apis/Entities/ForumCategory';
import { ForumThread } from '../../apis/Entities/ForumThread';

import ForumCategoryList from './components/ForumCategoryList';
import ForumThreadList from './components/ForumThreadList';
import ForumPostList from './components/ForumPostList';

import {
    ForumContainer
} from "./ForumElements";
import { LayoutContainer } from '../CourseViewer/CourseViewerElements';
import Sidebar from '../CourseViewer/Sidebar/Sidebar';
import { LayoutContentPage } from '../../components/LayoutElements';
import { getMyAccount } from '../../apis/Account/AccountApis';
import { getCourseWithoutEnrollmentByCourseId } from '../../apis/Course/CourseApis';
import { Account } from '../../apis/Entities/Account';
import { Course } from '../../apis/Entities/Course';


function ForumPage(props: any) {

    const [isTutor, setIsTutor] = useState<Boolean>();
    const [isStudent, setIsStudent] = useState<Boolean>();

    const loggedInAccountId = window.sessionStorage.getItem("loggedInAccountId") || "";
    const currentCourseId = parseInt(props.match.params.courseId);
    const [loading, setLoading] = useState<Boolean>(true);

    const [currentUser, setCurrentUser] = useState<Account>();
    const [currentCourse, setCurrentCourse] = useState<Course>();
    const [isIndexPage, setIsIndexPage] = useState<Boolean>();
    const [currentForumCategory, setCurrentForumCategory] = useState<ForumCategory>();
    const [currentForumThread, setCurrentForumThread] = useState<ForumThread>();

    const history = useHistory();

    useEffect(() => {
        setLoading(true);
        getMyAccount(parseInt(loggedInAccountId)).then(receivedAccount => {
            setCurrentUser(receivedAccount);
        });
        getCourseWithoutEnrollmentByCourseId(currentCourseId).then(receivedCourse => {
            setCurrentCourse(receivedCourse);
        });
        isTutorByCourseIdAndAccountId(currentCourseId, parseInt(loggedInAccountId))
            .then((tmpIsTutor: boolean) => setIsTutor(tmpIsTutor))
            .catch((err) => handleError(err));
        isStudentByCourseIdAndAccountId(currentCourseId, parseInt(loggedInAccountId))
            .then((tmpIsStudent: boolean) => setIsStudent(tmpIsStudent))
            .catch((err) => handleError(err));
        setLoading(false);
    }, [loggedInAccountId, currentCourseId])

    useEffect(() => {
        if (props.match.params.forumCategoryId != undefined) {
            getForumCategoryByForumCategoryId(props.match.params.forumCategoryId)
                .then((res) => {
                    setCurrentForumCategory(res);
                }).catch((err) => {
                    handleCallSnackbar({ message: err.response.data.message, type: "error" });
                });
        }
        if (props.match.params.forumThreadId != undefined) {
            getForumThreadByForumThreadId(props.match.params.forumThreadId)
                .then((res) => {
                    setCurrentForumThread(res);
                }).catch((err) => handleError(err));
        }
    }, [props.match.params.forumCategoryId, props.match.params.forumThreadId]);

    // To update isIndexPage
    useEffect(() => {
        setIsIndexPage(history.location.pathname === `/overview/course/${parseInt(props.match.params.courseId)}/forum`);
    }, [history.location.pathname])

    // To check access of user
    useEffect(() => {
        //check access
        var accessAllowed = true;
        if (currentCourse !== undefined && currentUser !== undefined) {
            // check access to category list
            accessAllowed = accessAllowed && checkCanViewCourse(currentUser, currentCourse)
            console.log(checkCanViewCourse(currentUser, currentCourse))
        }
        console.log("currentForumCategory", currentForumCategory);
        console.log("currentForumThread", currentForumThread);
        if (currentForumCategory !== undefined && currentForumThread !== undefined) {
            // check access to post list
            const listOfForumThreadId: any[] = currentForumCategory.forumThreads.map((thread) => thread.forumThreadId);
            accessAllowed = accessAllowed && listOfForumThreadId.includes(currentForumThread?.forumThreadId)
            console.log(listOfForumThreadId.includes(currentForumThread?.forumThreadId))
        }
        if (!accessAllowed) {
            const errorDataObj = {
                message1: 'Unable to view page',
                message2: 'You have no access to this page',
                errorStatus: '404',
                returnPath: '/progresspage',
                returnText: 'My Progress'
            }
            history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj } })
        }
    }, [currentCourse, currentForumCategory, currentForumThread])

    const checkCanViewCourse = (user: Account, course: Course) => {
        var listOfCourseIds = user.courses.map((course) => course.courseId);
        var listOfEnrolledCourseIds = user.enrolledCourses.map((enrolledCourse) => enrolledCourse.parentCourse.courseId);
        listOfCourseIds = listOfCourseIds.concat(listOfEnrolledCourseIds);
        return listOfCourseIds.includes(course.courseId);
    }


    const ForumBreadcrumbItems = [
        {
            name: "Forum",
            subpath: "/forum",
            fullpath: `/overview/course/${props.match.params.courseId}/forum`
        },
        {
            name: `${currentForumCategory?.name}`,
            subpath: "/category",
            fullpath: `/overview/course/${props.match.params.courseId}/forum/category/${props.match.params.forumCategoryId}`
        },
        {
            name: `${currentForumThread?.name}`,
            subpath: "/thread",
            fullpath: `/overview/course/${props.match.params.courseId}/forum/category/${props.match.params.forumCategoryId}/thread/${props.match.params.forumThreadId}`
        }
    ]

    function handleError(err: any): void {
        const errorDataObj = createErrorDataObj(err);
        props.callOpenSnackBar("Error in retrieving forum", "error");
        history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj } })
    }

    function createErrorDataObj(err: any): any {
        const errorDataObj = {
            message1: 'Unable to view forum',
            message2: err.response.data.message,
            errorStatus: err.response.status,
            returnPath: '/profile',
            returnText: 'My Profile'
        }

        return errorDataObj;
    }

    const handleCallSnackbar = (snackbarObject: any) => {
        props.callOpenSnackBar(snackbarObject.message, snackbarObject.type);
    }

    const isCurrentUserCourseTutor = () => {
        if (currentUser && currentCourse) {
            return currentCourse.tutor.accountId === currentUser?.accountId;
        } else {
            return false;
        }
    }

    return (
        <>
            {!loading && currentCourse && currentUser &&
                <LayoutContainer>
                    {/* HAX DUPLICATION OF SIDEBAR make sure to update props etc. of this side bar if the one in course viewer is updated*/}
                    <Sidebar course={currentCourse} isTutor={isTutor} isStudent={isStudent} />
                    <LayoutContentPage showSideBar style={{ paddingRight: "8rem" }}>
                        <ForumContainer>
                            <Breadcrumbs aria-label="profile-breadcrumb" style={{ marginBottom: "1rem" }}>
                                {
                                    ForumBreadcrumbItems.map((bcitem) => {
                                        if (history.location.pathname.includes(bcitem.subpath)) {
                                            const color = history.location.pathname === bcitem.fullpath ? "primary" : "inherit";
                                            return (<Link key={bcitem.fullpath} color={color} href={bcitem.fullpath}>{bcitem.name}</Link>);
                                        }
                                        else {
                                            return "";
                                        }
                                    })
                                }
                            </Breadcrumbs>

                            {isIndexPage &&
                                <ForumCategoryList key={"categoryList"}
                                    history={history}
                                    onCallSnackbar={handleCallSnackbar}
                                    currentCourseId={props.match.params.courseId} />
                            }

                            {!isIndexPage && history.location.pathname.includes("category") && !history.location.pathname.includes("thread") &&
                                <ForumThreadList key={"threadList"}
                                    history={history}
                                    onCallSnackbar={handleCallSnackbar}
                                    currentCourseId={props.match.params.courseId} currentForumCategoryId={props.match.params.forumCategoryId} />
                            }

                            {!isIndexPage && history.location.pathname.includes("thread") &&
                                <ForumPostList key={"postList"}
                                    history={history}
                                    currentCourse={currentCourse} currentForumCategoryId={props.match.params.forumCategoryId} currentForumThreadId={props.match.params.forumThreadId}
                                    onCallSnackbar={handleCallSnackbar} />
                            }

                        </ForumContainer>
                    </LayoutContentPage>
                </LayoutContainer>
            }
        </>


    );
}

export default ForumPage

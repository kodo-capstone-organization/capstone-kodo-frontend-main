import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import {
    Breadcrumbs, Link
} from '@material-ui/core';

import {
    getForumThreadByForumThreadIdAndCourseId,
    getForumCategoryByForumCategoryIdAndCourseId
} from "../../apis/Forum/ForumApis";
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
import { getCourseWithoutEnrollmentByCourseId } from '../../apis/Course/CourseApis';
import { Course } from '../../apis/Entities/Course';


function ForumPage(props: any) {

    const loggedInAccountId = parseInt(window.sessionStorage.getItem("loggedInAccountId") || "");

    const courseId = parseInt(props.match.params.courseId);
    const forumCategoryId = parseInt(props.match.params.forumCategoryId);
    const forumThreadId = parseInt(props.match.params.forumThreadId);

    const [isTutor, setIsTutor] = useState<Boolean>();
    const [isStudent, setIsStudent] = useState<Boolean>();
    const [loading, setLoading] = useState<Boolean>(true);

    const [isIndexPage, setIsIndexPage] = useState<Boolean>();
    const [currentCourse, setCurrentCourse] = useState<Course>();
    const [currentForumCategory, setCurrentForumCategory] = useState<ForumCategory>();
    const [currentForumThread, setCurrentForumThread] = useState<ForumThread>();

    const history = useHistory();

    useEffect(() => {
        if (!isNaN(loggedInAccountId) && !isNaN(courseId)) {
            setLoading(true);
            getCourseWithoutEnrollmentByCourseId(courseId).then(receivedCourse => {
                setCurrentCourse(receivedCourse);
            });
            isTutorByCourseIdAndAccountId(courseId, loggedInAccountId)
                .then((tmpIsTutor: boolean) => setIsTutor(tmpIsTutor))
                .catch((err) => handleError(err));
            isStudentByCourseIdAndAccountId(courseId, loggedInAccountId)
                .then((tmpIsStudent: boolean) => setIsStudent(tmpIsStudent))
                .catch((err) => handleError(err));
            setLoading(false);
        }
    }, [loggedInAccountId, courseId])

    // get selected category and thread
    useEffect(() => {
        if (!isNaN(forumCategoryId) && !isNaN(courseId)) {
            getForumCategoryByForumCategoryIdAndCourseId(forumCategoryId, courseId)
                .then((tmpForumCategory) => setCurrentForumCategory(tmpForumCategory))
                .catch((err) => handleError(err));
        }
    }, [forumCategoryId, courseId]);

    useEffect(() => {
        if (!isNaN(forumThreadId) && !isNaN(courseId)) {
            getForumThreadByForumThreadIdAndCourseId(forumThreadId, courseId)
                .then((tmpForumThread) => setCurrentForumThread(tmpForumThread))
                .catch((err) => handleError(err));
        }
    }, [forumThreadId, courseId]);

    useEffect(() => {
        if (isTutor !== undefined && isStudent !== undefined)
        {
            if (!isTutor && !isStudent) {
                secondaryHandleError();
            }
        }
    }, [isTutor, isStudent])

    // To update isIndexPage
    useEffect(() => {
        if (!isNaN(courseId)) {
            setIsIndexPage(history.location.pathname === `/overview/course/${courseId}/forum`);
        }
    }, [history.location.pathname])

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

    function secondaryHandleError(): void {
        const errorDataObj = {
            message1: 'Unable to view forum',
            message2: '',
            errorStatus: 403,
            returnPath: '/profile',
            returnText: 'My Profile'
        }
        props.callOpenSnackBar("Error in retrieving forum", "error");
        history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj }})
    }

    const handleCallSnackbar = (snackbarObject: any) => {
        props.callOpenSnackBar(snackbarObject.message, snackbarObject.type);
    }

    return (
        <>
            {!loading && currentCourse &&
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

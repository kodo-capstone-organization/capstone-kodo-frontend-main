import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import {
    Breadcrumbs, Link
} from '@material-ui/core';

import { getForumThreadByForumThreadId, getForumCategoryByForumCategoryId } from "../../apis/Forum/ForumApis";

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
            console.log(receivedCourse)
            setCurrentCourse(receivedCourse);
        });
        setLoading(false);
    }, [loggedInAccountId, currentCourseId])

    useEffect(() => {
        if (props.match.params.forumCategoryId != undefined) {
            getForumCategoryByForumCategoryId(props.match.params.forumCategoryId)
                .then((res) => {
                    setCurrentForumCategory(res);
                    console.log("getForumCategoryByForumCategoryId in index", props.match.params);
                }).catch((err) => {
                    handleCallSnackbar({ message: err.response.data.message, type: "error" });
                });
        }
        if (props.match.params.forumThreadId != undefined) {
            getForumThreadByForumThreadId(props.match.params.forumThreadId)
                .then((res) => {
                    setCurrentForumThread(res);
                }).catch((err) => {
                    handleCallSnackbar({ message: err.response.data.message, type: "error" });
                });
        }
    }, [props.match.params.forumCategoryId, props.match.params.forumThreadId]);

    // To update isIndexPage
    useEffect(() => {
        setIsIndexPage(history.location.pathname === `/overview/course/${parseInt(props.match.params.courseId)}/forum`);
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
                    <Sidebar course={currentCourse} account={currentUser} isTutorView={isCurrentUserCourseTutor()} />
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
                                                currentCourseId={props.match.params.courseId} currentForumCategoryId={props.match.params.forumCategoryId}/>
                            }

                            {!isIndexPage && history.location.pathname.includes("thread") &&
                                <ForumPostList key={"postList"}
                                                history={history}
                                                currentCourseId={props.match.params.courseId} currentForumCategoryId={props.match.params.forumCategoryId} currentForumThreadId={props.match.params.forumThreadId}
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

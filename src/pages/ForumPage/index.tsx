import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import { getCourseByCourseId } from "../../apis/Course/CourseApis";
import { getForumCategoryByCourseId } from "../../apis/Forum/ForumApis";
import { Course } from '../../apis/Entities/Course';
import { ForumCategory } from '../../apis/Entities/ForumCategory';

import {
    ForumContainer
} from "./ForumElements";
import {
    IconButton, Breadcrumbs, Link
} from '@material-ui/core';

import ForumCategoryList from './components/ForumCategoryList';
import ForumThreadList from './components/ForumThreadList';





function ForumPage(props: any) {

    const courseId = parseInt(props.match.params.courseId);
    const loggedInAccountId = window.sessionStorage.getItem("loggedInAccountId");
    const [isIndexPage, setIsIndexPage] = useState<Boolean>();
    // const [selectedQuestions, setSelectedQuestions] = useState<any>([]);
    const history = useHistory();

    useEffect(() => {
        getCourseByCourseId(courseId).then((res) => {
            if (loggedInAccountId && res.tutor.accountId !== parseInt(loggedInAccountId)) {
                history.push("/profile");
            }
        });
    }, []);

    // To update isIndexPage
    useEffect(() => {
        setIsIndexPage(history.location.pathname === `/forum/${courseId}`);
    }, [history.location.pathname])

    const ForumBreadcrumbItems = [
        {
            name: "Forum",
            subpath: "/forum",
            fullpath: `/forum/${courseId}`
        },
        {
            name: "Category",
            subpath: "/category",
            fullpath: `/forum/${courseId}/category/:forumCategoryId`
        }
    ]

    const handleCallSnackbar = (snackbarObject: any) => {
        props.callOpenSnackBar(snackbarObject.message, snackbarObject.type);
    }

    // const checkForumThreadList = () => {
    //     const checkIfIndex = !isIndexPage;
    //     const checkPathname = history.location.pathname.includes("category");
    //     var forumCategoryId = props.history.location.pathname;
    //     forumCategoryId = parseInt(forumCategoryId.split('/category/')[1]);
    //     const forumCategoryIdList = forumCategories.map(cat => parseInt(cat.forumCategoryId));
    //     const isCategoryInCourse = forumCategoryIdList.includes(forumCategoryId);
    //     console.log("check", checkIfIndex)
    //     console.log("check", checkPathname)
    //     console.log("check", isCategoryInCourse)

    //     return checkIfIndex && checkPathname && isCategoryInCourse
    // }

    return (
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
            {isIndexPage && <ForumCategoryList history={history} courseId={courseId} onCallSnackbar={handleCallSnackbar} />}
            {!isIndexPage && history.location.pathname.includes("category") && <ForumThreadList history={history} courseId={courseId} onCallSnackbar={handleCallSnackbar} />}

        </ForumContainer>
    );
}

export default ForumPage

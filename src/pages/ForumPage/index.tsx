import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import { getCourseByCourseId } from "../../apis/Course/CourseApis";
import { getForumCategoryByCourseId } from "../../apis/Forum/ForumApis";
import { ForumCategory } from '../../apis/Entities/ForumCategory';

import {
    ForumContainer, ForumCardHeader, ForumCardContent, ForumCard,
} from "./ForumElements";
import {
    DataGrid,
    GridColDef,
    GridValueGetterParams
} from '@material-ui/data-grid';
import { Button } from "../../values/ButtonElements";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {
    IconButton, Breadcrumbs, Link
} from '@material-ui/core';

import ForumCategories from './components/ForumCategories';


function ForumPage(props: any) {

    const courseId = props.match.params.courseId;
    const loggedInAccountId = window.sessionStorage.getItem("loggedInAccountId");
    const [forumCategories, setForumCategories] = useState<ForumCategory[]>([]);
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
        console.log("reach parent");
        props.callOpenSnackBar(snackbarObject.message, snackbarObject.type);
    }

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
            {isIndexPage && <ForumCategories courseId={courseId} onCallSnackbar={handleCallSnackbar} />}
        </ForumContainer>
    );
}

export default ForumPage

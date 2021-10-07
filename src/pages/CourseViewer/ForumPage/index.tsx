import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import {
    ForumContainer
} from "./ForumElements";
import {
    IconButton, Breadcrumbs, Link
} from '@material-ui/core';

import ForumCategoryList from './components/ForumCategoryList';
import ForumThreadList from './components/ForumThreadList';
import ForumPostList from './components/ForumPostList';

function ForumPage(props: any) {

    const courseId = parseInt(props.match.params.courseId);
    const loggedInAccountId = window.sessionStorage.getItem("loggedInAccountId");
    const [isIndexPage, setIsIndexPage] = useState<Boolean>();
    const history = useHistory();

    useEffect(() => {
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
        },
        {
            name: "Thread",
            subpath: "/thread",
            fullpath: `/forum/${courseId}/category/:forumCategoryId/thread/:forumThreadId`
        }
    ]

    const handleCallSnackbar = (snackbarObject: any) => {
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
            {isIndexPage && <ForumCategoryList history={history} courseId={courseId} onCallSnackbar={handleCallSnackbar} />}
            {!isIndexPage && history.location.pathname.includes("category") && !history.location.pathname.includes("thread") && <ForumThreadList history={history} courseId={courseId} onCallSnackbar={handleCallSnackbar} />}
            {!isIndexPage && history.location.pathname.includes("thread") && <ForumPostList history={history} courseId={courseId} onCallSnackbar={handleCallSnackbar} />}

        </ForumContainer>
    );
}

export default ForumPage

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

import { getForumThreadByForumThreadId, getForumCategoryByForumCategoryId } from "../../apis/Forum/ForumApis";
import { ForumCategory } from '../../../apis/Entities/ForumCategory';
import { ForumThread } from '../../../apis/Entities/ForumThread';


function ForumPage(props: any) {

    const loggedInAccountId = window.sessionStorage.getItem("loggedInAccountId");
    const [isIndexPage, setIsIndexPage] = useState<Boolean>();
    const [currentCourseId, setCurrentCourseId] = useState<number>();
    const [currentForumCategory, setCurrentForumCategory] = useState<ForumCategory>();
    const [currentForumThread, setCurrentForumThread] = useState<ForumThread>();


    const history = useHistory();

    useEffect(() => {
        const courseId = parseInt(props.match.params.courseId);
        setCurrentCourseId(courseId);
        console.log("param", props.match.params.forumCategoryId);
        if(props.match.params.forumCategoryId != undefined){
            getForumCategoryByForumCategoryId(props.match.params.forumCategoryId)
            .then((res) => {
                setCurrentForumCategory(res);
            }).catch((err) => {
                handleCallSnackbar({message: err.response.data.message, type:"error"});
            });
        }
        console.log("param", props.match.params.forumThreadId);
        if(props.match.params.forumThreadId != undefined){
            getForumThreadByForumThreadId(props.match.params.forumThreadId)
            .then((res) => {
                setCurrentForumThread(res);
            }).catch((err) => {
                handleCallSnackbar({message: err.response.data.message, type:"error"});
            });
        }

    }, [props]);

    // To update isIndexPage
    useEffect(() => {
        setIsIndexPage(history.location.pathname === `/forum/${parseInt(props.match.params.courseId)}`);
    }, [history.location.pathname])

    const ForumBreadcrumbItems = [
        {
            name: "Forum",
            subpath: "/forum",
            fullpath: `/forum/${props.match.params.courseId}`
        },
        {
            name: `${currentForumCategory?.name}`,
            subpath: "/category",
            fullpath: `/forum/${props.match.params.courseId}/category/${props.match.params.forumCategoryId}`
        },
        {
            name: `${currentForumThread?.name}`,
            subpath: "/thread",
            fullpath: `/forum/${props.match.params.courseId}/category/${props.match.params.forumCategoryId}/thread/${props.match.params.forumThreadId}`
        }
    ]

    const handleCallSnackbar = (snackbarObject: any) => {
        props.callOpenSnackBar(snackbarObject.message, snackbarObject.type);
    }

    // const handleUpdateCurrentForumCategory = (forumCategoryId: number) => {
    //     getForumCategoryByForumCategoryId(forumCategoryId)
    //     .then((res) => {
    //         setCurrentForumCategory(res);
    //     }).catch((err) => {
    //         handleCallSnackbar({message: err.response.data.message, type:"error"});
    //     });
    // }

    // const handleUpdateCurrentForumThread = (forumThreadId: number) => {
    //     getForumThreadByForumThreadId(forumThreadId)
    //     .then((res) => {
    //         setCurrentForumThread(res);
    //     }).catch((err) => {
    //         handleCallSnackbar({message: err.response.data.message, type:"error"});

    //     });
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
            {isIndexPage && 
            <ForumCategoryList history={history} 
            onCallSnackbar={handleCallSnackbar} 
            currentCourseId={currentCourseId} />
            }

            {
            !isIndexPage && history.location.pathname.includes("category") && !history.location.pathname.includes("thread") && 
            <ForumThreadList history={history} 
            onCallSnackbar={handleCallSnackbar} 
            currentCourseId={currentCourseId} currentForumCategoryId={currentForumCategory?.forumCategoryId} 
            // onHandleUpdateCurrentForumThread={handleUpdateCurrentForumThread}
            />
            }

            {
            !isIndexPage && history.location.pathname.includes("thread") && 
            <ForumPostList history={history} 
            currentCourseId={currentCourseId} currentForumCategoryId={currentForumCategory?.forumCategoryId} currentForumThreadId={currentForumThread?.forumThreadId} 
            onCallSnackbar={handleCallSnackbar} />
            }

        </ForumContainer>
    );
}

export default ForumPage

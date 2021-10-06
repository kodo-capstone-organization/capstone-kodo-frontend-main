import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { getForumCategoryByForumCategoryId } from "../../../apis/Forum/ForumApis";
import { ForumCategory } from '../../../apis/Entities/ForumCategory';

import {
    ForumContainer, ForumCardHeader, ForumCardContent, ForumCard,
    ForumThreadCard, ForumThreadCardContent, EmptyStateContainer,
    EmptyStateText
} from "../ForumElements";
import {
    DataGrid,
    GridColDef,
    GridValueGetterParams
} from '@material-ui/data-grid';
import ForumIcon from '@material-ui/icons/Forum';

import { Button } from "../../../values/ButtonElements";
import {
    Divider, Typography, Avatar, Link
} from '@material-ui/core';

import ForumThreadModal from './ForumThreadModal';
import { ForumThread } from '../../../apis/Entities/ForumThread';


function ForumThreadList(props: any) {

    const [courseId, setCourseId] = useState<number>();
    const [forumCategory, setForumCategory] = useState<ForumCategory>();
    const [forumThreads, setForumThreads] = useState<ForumThread[]>([]);

    // const [selectedQuestions, setSelectedQuestions] = useState<any>([]);

    useEffect(() => {
        var forumCategoryId = props.history.location.pathname;
        forumCategoryId = parseInt(forumCategoryId.split('/category/')[1]);
        getForumCategoryByForumCategoryId(forumCategoryId).then((res) => {
            setForumCategory(res);
            setForumThreads(res.forumThreads);
        }).catch((err) => {
            props.onCallSnackbar({ message: "Failure", type: "error" })
        })
        console.log(forumCategoryId)
        setCourseId(props.courseId)

    }, [props]);

    const handleCallSnackbar = (snackbarObject: any) => {
        getForumCategoryByCourseId(props.courseId).then((res) => {
            res.map((q) => {
                Object.assign(q, { id: q.forumCategoryId })
                return q;
            });
            setForumCategories(res);
        }).catch((err) => {
            console.log("Failed", err);
        });
        props.onCallSnackbar(snackbarObject);
    }

    const navigateToIndividualCategory = (forumCategoryId: number) => {
        // props.history.push(`/forum/${courseId}/category/${forumCategoryId}`);
    }

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    const mapThreads = (forumThreads: ForumThread[]) => {
        return (
            <div>
                {forumThreads.map(function (thread, threadId) {
                    return (
                        <>
                            <ForumThreadCard key={threadId}>
                                <Avatar alt="Remy Sharp" src={thread.account.displayPictureUrl} />
                                <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                    <Link>{thread.name}</Link>
                                    <br />
                                    {formatDate(thread.timeStamp)}  |  {thread.account.name}
                                </Typography>
                                <Typography variant="body1" component="div" style={{ marginLeft: "auto" }}>
                                    {thread.forumPosts.length} Replies
                                <ForumIcon />
                                </Typography>
                            </ForumThreadCard>
                        </>
                    );
                })}
            </div>
        );
    }

    return (
        <ForumCard>
            {
                forumCategory !== undefined &&
                < ForumCardHeader
                    title={forumCategory.name}
                    action={
                        <ForumThreadModal modalType={"CREATE"} courseId={props.courseId} onForumCategoryChange={handleCallSnackbar} />
                    }
                />
            }

            <ForumThreadCardContent>
                {mapThreads(forumThreads)}
                {
                    <EmptyStateContainer threadsExist={forumThreads.length > 0}>
                        <Typography>No threads currently 🥺</Typography>
                        <ForumThreadModal modalType={"EMPTY"} courseId={props.courseId} onForumCategoryChange={handleCallSnackbar} />
                    </EmptyStateContainer>
                }
            </ForumThreadCardContent>
        </ForumCard>
    );
}

export default ForumThreadList
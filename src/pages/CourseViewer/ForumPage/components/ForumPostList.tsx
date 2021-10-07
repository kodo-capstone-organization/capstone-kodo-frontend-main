import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { getForumThreadByForumThreadId, getAllForumPostsOfAForumThread, createNewForumPost } from "../../../apis/Forum/ForumApis";
import { ForumCategory } from '../../../apis/Entities/ForumCategory';
import { ForumThread } from '../../../apis/Entities/ForumThread';
import { ForumPost } from '../../../apis/Entities/ForumPost';

import {
    ForumContainer, ForumCardHeader, ForumCardContent, ForumCard,
    ForumThreadCard, ForumThreadCardContent, EmptyStateContainer,
    EmptyStateText, ForumPostCard, ForumPostCardContent
} from "../ForumElements";
import ReplyIcon from '@material-ui/icons/Reply';
import { Button } from "../../../values/ButtonElements";
import {
    Divider, Typography, Avatar, IconButton
} from '@material-ui/core';

import ForumPostInputArea from './ForumPostInputArea';


function ForumPostList(props: any) {

    const [courseId, setCourseId] = useState<number>();
    const [forumThread, setForumThread] = useState<ForumThread>();
    const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);

    // const [selectedQuestions, setSelectedQuestions] = useState<any>([]);

    useEffect(() => {
        var url = props.history.location.pathname;
        const forumThreadId = parseInt(url.split('/thread/')[1]);
        getForumThreadByForumThreadId(forumThreadId).then((res) => {
            setForumThread(res);
        }).catch((err) => {
            props.onCallSnackbar({ message: "Failure", type: "error" })
        });
        getAllForumPostsOfAForumThread(forumThreadId).then((res) => {
            setForumPosts(res);
        }).catch((err) => {
            props.onCallSnackbar({ message: "Failure", type: "error" })
        });

    }, [props]);

    const handleCallSnackbar = (snackbarObject: any) => {
        getForumThreadByForumThreadId(forumThread.forumThreadId).then((res) => {
            setForumThread(res);
        }).catch((err) => {
            props.onCallSnackbar({ message: "Failure", type: "error" })
        });
        props.onCallSnackbar(snackbarObject);
    }

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    const mapPosts = (forumPosts: ForumPost[]) => {
        return (
            <div>
                {forumPosts.map(function (post, postId) {
                    return (
                        <>
                            <ForumPostCard key={postId}>
                                <ForumPostCardContent>
                                    <Avatar alt="Remy Sharp" src={post.account.displayPictureUrl} />
                                    <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                        <body style={{ color: "blue" }}>RE: {forumThread.name}</body>
                                        <br />
                                    Posted By {post.account.name} on {formatDate(post.timeStamp)}
                                    </Typography>
                                </ForumPostCardContent>
                                <Divider />
                                <ForumPostCardContent>
                                    <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                        {post.message}
                                    </Typography>
                                </ForumPostCardContent>
                                <Divider />
                                <ForumPostInputArea forumThread={forumThread} onForumPostChange={handleCallSnackbar} />
                            </ForumPostCard>
                        </>
                    );
                })}
            </div>
        );
    }

    return (
        <ForumCard>
            {
                forumThread !== undefined &&
                < ForumCardHeader
                    title="Thread"
                />
            }

            <ForumCardContent>
                {
                    forumThread != undefined &&
                    <ForumPostCard id="post-card">
                        <ForumPostCardContent>
                            <Avatar alt="Remy Sharp" src={forumThread.account.displayPictureUrl} />
                            <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                <body style={{ color: "blue" }}>{forumThread.name}</body>
                                <br />
                            Posted By {forumThread.account.name} on {formatDate(forumThread.timeStamp)}
                            </Typography>
                        </ForumPostCardContent>
                        <Divider />
                        <ForumPostCardContent>
                            <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                {forumThread.description}
                            </Typography>
                        </ForumPostCardContent>
                        <Divider />
                        <ForumPostInputArea forumThread={forumThread} onForumPostChange={handleCallSnackbar} />
                    </ForumPostCard>
                }
            </ForumCardContent>

            <ForumCardContent>
                <body id="replies">
                    Replies
                </body>
            </ForumCardContent>

            <ForumCardContent>

                {forumThread != undefined && mapPosts(forumPosts)}
            </ForumCardContent>
        </ForumCard>
    );
}

export default ForumPostList
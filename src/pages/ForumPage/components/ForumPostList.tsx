import { useEffect, useState } from 'react';

import {
    Divider, Typography, CircularProgress
} from '@material-ui/core';

import { ForumThread } from '../../../apis/Entities/ForumThread';
import { ForumPost } from '../../../apis/Entities/ForumPost';

import {
    getForumThreadByForumThreadId,
    getAllForumPostsByForumThreadId
} from "../../../apis/Forum/ForumApis";

import {
    ForumCardHeader, ForumCardContent, ForumCard, ForumPostCard,
    ForumPostCardContent, ForumAvatar, ScrollLink
} from "../ForumElements";

import ForumPostInputArea from './ForumPostInputArea';
import ForumPostReplyList from "./ForumPostReplyList";


function ForumPostList(props: any) {

    const [courseId, setCourseId] = useState<number>();
    const [forumThread, setForumThread] = useState<ForumThread>();
    const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
    const [currentForumThreadId, setCurrentForumThreadId] = useState<number>();
    const [currentForumCategoryId, setCurrentForumCategoryId] = useState<number>();
    const [loading, setLoading] = useState<boolean>();

    useEffect(() => {
        setLoading(true);
        setCourseId(props.courseId);
        setCurrentForumCategoryId(props.currentForumCategoryId);
        if (props.currentForumThreadId != undefined) {
            setCurrentForumThreadId(props.currentForumThreadId);
            getForumThreadByForumThreadId(props.currentForumThreadId).then((res) => {
                setForumThread(res);
            }).catch((err) => {
                props.onCallSnackbar({ message: "Failure", type: "error" })
            });
            getAllForumPostsByForumThreadId(props.currentForumThreadId).then((res) => {
                console.log(res);
                setForumPosts(res);
                setLoading(false);
            }).catch((err) => {
                props.onCallSnackbar({ message: "Failure", type: "error" })
            });
        }
    }, [props.currentForumCategoryId, props.currentForumThreadId, props.courseId]);

    const handleCallSnackbar = (snackbarObject: any) => {
        if (forumThread !== undefined) {
            if (snackbarObject.type === "success") {
                getAllForumPostsByForumThreadId(forumThread.forumThreadId).then((res) => {
                    setForumPosts(res);
                }).catch((err) => {
                    props.onCallSnackbar({ message: "Failure", type: "error" })
                });
            }
            props.onCallSnackbar(snackbarObject);
        } else {
            props.onCallSnackbar({ message: "Forum Post Failed", type: "error" });
        }
    }

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    const handleOnSetActive = (msg: string) => {
        console.log("handleOnSetActive", msg);
    }

    const handleOnSetInactive = (msg: string) => {
        console.log("handleOnSetInactive", msg);
    }

    const mapPosts = (forumPosts: ForumPost[]) => {
        return (
            <div>
                {forumPosts.map(function (post, postId) {
                    return (
                        <>
                            <ForumPostCard key={postId} name={post.forumPostId}>
                                {forumThread !== undefined &&
                                    <ForumPostCardContent>
                                        <ForumAvatar alt="Remy Sharp" src={post.account.displayPictureUrl} />
                                        <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                            RE: {forumThread.name}
                                            <br />
                                            Posted By {post.account.name} on {formatDate(post.timeStamp)}
                                        </Typography>
                                    </ForumPostCardContent>
                                }
                                <Divider />
                                <ForumPostCardContent>
                                    <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                        {post.message}
                                    </Typography>
                                </ForumPostCardContent>
                                <Divider />
                                <ForumPostInputArea postType={"REPLY"} history={props.history} courseId={courseId} forumPost={post} onForumPostChange={handleCallSnackbar} />
                            </ForumPostCard>
                        </>
                    );
                })}
            </div>
        );
    }

    if (loading) {
        return (
            <ForumCard>
                {
                    < ForumCardHeader
                        title="Loading ..."
                    />
                }

                <ForumCardContent>
                    <CircularProgress />
                </ForumCardContent>
            </ForumCard>
        );
    } else {
        return (
            <ForumCard>
                {
                    forumThread !== undefined &&
                    < ForumCardHeader
                        title={forumThread.name}
                    />
                }

                <ForumCardContent>
                    {
                        forumThread != undefined &&
                        <ForumPostCard name="parentThread">
                            <ForumPostCardContent>
                                <ForumAvatar alt="Remy Sharp" src={forumThread.account.displayPictureUrl} />
                                <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                    {forumThread.name}
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
                            <ForumPostInputArea history={props.history} courseId={courseId} postType={"POST"} currentForumCategoryId={currentForumCategoryId} forumThread={forumThread} onForumPostChange={handleCallSnackbar} />
                        </ForumPostCard>
                    }
                </ForumCardContent>

                <body id="replies" style={{marginLeft:"350px"}}>
                    Replies
                </body>

                <ForumCardContent>

                    {forumThread != undefined && mapPosts(forumPosts)}
                </ForumCardContent>
            </ForumCard>
        );
    }

}

export default ForumPostList
import { useEffect, useState } from 'react';

import {
    Divider, Typography, CircularProgress, Chip
} from '@material-ui/core';

import { ForumThread } from '../../../apis/Entities/ForumThread';
import { ForumPostWithRepliesResp, ForumPost } from '../../../apis/Entities/ForumPost';

import {
    getForumThreadByForumThreadId,
    getAllForumPostsByForumThreadId
} from "../../../apis/Forum/ForumApis";

import {
    ForumCardHeader, ForumCardContent, ForumCard, ForumPostCard,
    ForumPostCardContent, ForumAvatar
} from "../ForumElements";
import { colours } from "../../../values/Colours";

import ForumPostInputArea from './ForumPostInputArea';


function ForumPostList(props: any) {

    const [courseId, setCourseId] = useState<number>();
    const [forumThread, setForumThread] = useState<ForumThread>();
    const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
    const [currentForumCategoryId, setCurrentForumCategoryId] = useState<number>();
    const [loading, setLoading] = useState<boolean>();

    useEffect(() => {
        setLoading(true);
        setCourseId(props.currentCourseId);
        setCurrentForumCategoryId(props.currentForumCategoryId);
        if (props.currentForumThreadId != undefined) {
            getForumThreadByForumThreadId(parseInt(props.currentForumThreadId)).then((res) => {
                setForumThread(res);
            }).catch((err) => {
                props.onCallSnackbar({ message: "Failure", type: "error" })
            });
            getAllForumPostsByForumThreadId(parseInt(props.currentForumThreadId)).then((res) => {
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
                                            {
                                                post.isReported &&
                                                <Chip label="Reported" color="secondary"/>
                                            }
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
                                <ForumPostInputArea postType={"GENERAL"} history={props.history} courseId={courseId} forumPost={post} onForumPostChange={handleCallSnackbar} />
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

                <ForumCardContent>
                    Replies
                </ForumCardContent>

                <ForumCardContent>
                    {forumThread != undefined && mapPosts(forumPosts)}
                </ForumCardContent>
            </ForumCard>
        );
    }

}

export default ForumPostList
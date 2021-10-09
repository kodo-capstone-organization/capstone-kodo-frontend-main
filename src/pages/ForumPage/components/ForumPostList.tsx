import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import {Link} from 'react-scroll'

import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { getForumThreadByForumThreadId, getAllForumPostsOfAForumThread, createNewForumPost } from "../../../apis/Forum/ForumApis";
import { ForumCategory } from '../../../apis/Entities/ForumCategory';
import { ForumThread } from '../../../apis/Entities/ForumThread';
import { ForumPost } from '../../../apis/Entities/ForumPost';

import {
    ForumContainer, ForumCardHeader, ForumCardContent, ForumCard,
    ForumThreadCard, ForumThreadCardContent, EmptyStateContainer,
    EmptyStateText, ForumPostCard, ForumPostCardContent,
    ForumAvatar
} from "../ForumElements";
import ReplyIcon from '@material-ui/icons/Reply';
import { Button } from "../../../values/ButtonElements";
import {
    Divider, Typography, Avatar, IconButton,
    CircularProgress
} from '@material-ui/core';

import ForumPostInputArea from './ForumPostInputArea';


function ForumPostList(props: any) {

    const [courseId, setCourseId] = useState<number>();
    const [forumThread, setForumThread] = useState<ForumThread>();
    const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
    const [currentForumThreadId, setCurrentForumThreadId] = useState<number>();
    const [currentForumCategoryId, setCurrentForumCategoryId] = useState<number>();
    const [loading, setLoading] = useState<boolean>();


    // const [selectedQuestions, setSelectedQuestions] = useState<any>([]);

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
            getAllForumPostsOfAForumThread(props.currentForumThreadId).then((res) => {
                setForumPosts(res);
                setLoading(false);
            }).catch((err) => {
                props.onCallSnackbar({ message: "Failure", type: "error" })
            });
        }
    }, [props.currentForumCategoryId, props.currentForumThreadId, props.courseId]);

    const handleCallSnackbar = (snackbarObject: any) => {
        if (snackbarObject.type === "success") {
            getAllForumPostsOfAForumThread(forumThread.forumThreadId).then((res) => {
                setForumPosts(res);
            }).catch((err) => {
                props.onCallSnackbar({ message: "Failure", type: "error" })
            });
        }
        props.onCallSnackbar(snackbarObject);
    }

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    // export interface ForumPost {
    //     forumPostId: number,
    //     message: string,
    //     timeStamp: Date,
    //     parentForumPost: (ForumPost | null)
    //     account: Account
    // }

    // export interface ForumThread {
    //     forumThreadId: number,
    //     name: string,
    //     description: string,
    //     timeStamp: Date,
    //     account: Account,
    //     forumPosts: ForumPost[]
    // }

    const handleOnSetActive = (msg : string) =>{
        console.log("handleOnSetActive", msg);
    }

    const handleOnSetInactive = (msg : string) =>{
        console.log("handleOnSetInactive", msg);
    }

    const mapPosts = (forumPosts: ForumPost[]) => {
        return (
            <div>
                {forumPosts.map(function (post, postId) {
                    return (
                        <>
                            <ForumPostCard key={postId} name={post.forumPostId}>
                                <ForumPostCardContent>
                                    <ForumAvatar alt="Remy Sharp" src={post.account.displayPictureUrl} />
                                    <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                    <Link  to={post.parentForumPost != null ? post.parentForumPost.forumPostId : "parentThread"} 
                                          offset={-50} onSetActive={() => handleOnSetActive(post.message)} activeClass="true"
                                          onSetInactive={()=>handleOnSetInactive(post.message)} spy={true}
                                          smooth={true}>RE: {post.parentForumPost != null ? post.parentForumPost.message : forumThread.name}</Link>
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

}

export default ForumPostList
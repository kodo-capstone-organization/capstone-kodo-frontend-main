import { useEffect, useState } from 'react';

import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import ReplyIcon from '@material-ui/icons/Reply';

import {
    IconButton,
    TextField,
    Typography,
    Divider,
    Chip
} from "@material-ui/core";

import { Account } from "../../../apis/Entities/Account";
import { ForumPost, CreateNewForumPostReq, CreateNewForumPostReplyReq } from '../../../apis/Entities/ForumPost';
import { ForumThread } from '../../../apis/Entities/ForumThread';

import { createNewForumPost, createNewForumPostReply } from "../../../apis/Forum/ForumApis";
import { getMyAccount } from "../../../apis/Account/AccountApis";

import ForumPostModal from './ForumPostModal';

import {
    ForumPostCardContent,
    ForumAvatar,
    ForumPostReplyCard,
    ForumPostReplyCardContent,
    ForumReportedChip
} from "../ForumElements";

import { Button } from "../../../values/ButtonElements";


function ForumPostInputArea(props: any) {

    const [message, setMessage] = useState<string>("");
    const [forumThread, setForumThread] = useState<ForumThread>();
    const [parentForumPost, setParentForumPost] = useState<ForumPost>();
    const [childForumPosts, setChildForumPosts] = useState<ForumPost[]>([]);
    // const [currentForumCategoryId, setCurrentForumCategoryId] = useState<number>();
    // const [courseId, setCourseId] = useState<number>();
    // const [course, setCourse] = useState<Course>();
    const [postType, setPostType] = useState<string>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [myAccount, setMyAccount] = useState<Account>();
    const loggedInAccountId = JSON.parse(window.sessionStorage.getItem("loggedInAccountId") || "{}");

    useEffect(() => {
        if (props.forumThread !== undefined) {
            setForumThread(props.forumThread);
        }
        if (props.forumPost !== undefined) {
            setParentForumPost(props.forumPost);
        }
        if (props.forumPost !== undefined) {
            setChildForumPosts(props.forumPost?.replies);
            console.log("props.forumPost?.replies", props.forumPost?.replies);
        }
        if (props.postType !== undefined) {
            setPostType(props.postType);
        }
        getMyAccount(loggedInAccountId).then((res) => {
            setMyAccount(res);
        }).catch((err) => {
            console.log("Failed", err);
        });
    }, [props]);

    const handleOpen = () => {
        setIsOpen(true);
    }

    const handleCancel = () => {
        setMessage("");
        setPostType("");
        setIsOpen(false);
    }

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    const handleCreateConfirm = () => {
        if (postType === "POST" && forumThread !== undefined) {
            const createNewForumPostReq: CreateNewForumPostReq = {
                message,
                timeStamp: new Date(),
                accountId: loggedInAccountId,
                forumThreadId: forumThread.forumThreadId
            }
            createNewForumPost(createNewForumPostReq)
                .then((res) => {
                    props.onForumPostChange({ message: "Forum Thread Reply Succeeded", type: "success" });
                }).catch((err) => {
                    props.onForumPostChange({ message: err.response.data.message, type: "error" });
                });
            handleCancel();
        } else if ((postType === "REPLY" || postType === "GENERAL")
            && myAccount !== undefined
            && parentForumPost !== undefined
            && parentForumPost.forumPostId !== null
        ) {
            const newForumPostReply: ForumPost = {
                forumPostId: null,
                message,
                timeStamp: new Date(),
                reported: false,
                reasonForReport: null,
                replies: [],
                parentForumPost: null,
                account: myAccount,
            }
            const createNewForumPostReplyReq: CreateNewForumPostReplyReq = {
                newForumPostReply,
                accountId: loggedInAccountId,
                parentForumPostId: parentForumPost.forumPostId
            }
            createNewForumPostReply(createNewForumPostReplyReq)
                .then((res) => {
                    props.onForumPostChange({ message: "Forum Thread Reply Succeeded", type: "success" });

                }).catch((err) => {
                    props.onForumPostChange({ message: err.response.data.message, type: "error" });
                })
        }
        setMessage("");
    }

    const handleCallSnackbar = (snackbarObject: any) => {
        props.onForumPostChange(snackbarObject);
    }

    const handleSeeReplies = () => {
        handleOpen();
        console.log("handleSeeReplies");
    }

    const handleMakeReply = () => {
        setPostType("REPLY");
        handleOpen();
    }

    const mapReplies = (forumPosts: ForumPost[]) => {
        return (
            <>
                {forumPosts.map(function (post, postId) {
                    return (
                            <ForumPostReplyCard key={postId} name={post.forumPostId} elevation={0} variant="outlined">
                                <ForumPostReplyCardContent>
                                    <ForumAvatar alt="Remy Sharp" src={post.account.displayPictureUrl} />
                                    <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                        Posted By {post.account.name} on {formatDate(post.timeStamp)}
                                    </Typography>
                                    {
                                        post.reported &&
                                        <ForumReportedChip label="Reported" color="secondary" reported={post.reported} />
                                    }
                                </ForumPostReplyCardContent>
                                <Divider />
                                <ForumPostReplyCardContent>
                                    <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                        {post.message}
                                    </Typography>
                                </ForumPostReplyCardContent>
                                <Divider />
                                <div style={{ display: "flex" }}>
                                    <ForumPostModal forumPost={post} modalType={"DELETEREPLY"} onForumPostChange={handleCallSnackbar} />
                                    <ForumPostModal forumPost={post} modalType={"REPORTREPLY"} onForumPostChange={handleCallSnackbar} />
                                </div>
                            </ForumPostReplyCard>
                    );
                })}
            </>
        );
    }


    return (
        <>
            {
                !isOpen &&
                <div style={{ display: "flex" }}>
                    {
                        postType === "GENERAL" &&
                        <>
                            <IconButton disabled={childForumPosts.length < 1} onClick={handleSeeReplies} style={{ width: "fit-content", marginInlineStart: "auto", fontSize: "unset" }}>
                                <QuestionAnswerIcon /> {childForumPosts.length} Replies
                            </IconButton>
                            <IconButton onClick={handleMakeReply} style={{ width: "fit-content", fontSize: "unset" }}>
                                <ReplyIcon /> Reply
                            </IconButton>
                            <ForumPostModal forumPost={parentForumPost} modalType={"DELETEPARENTPOST"} onForumPostChange={handleCallSnackbar} />
                            <ForumPostModal forumPost={parentForumPost} modalType={"REPORTPARENTPOST"} onForumPostChange={handleCallSnackbar} />

                        </>
                    }
                    {
                        postType === "POST" &&
                        <>
                            <IconButton onClick={handleMakeReply} style={{ width: "fit-content", marginInlineStart: "auto", fontSize: "unset" }}>
                                <ReplyIcon /> Reply
                            </IconButton>
                        </>
                    }
                </div>
            }

            {/* For viewing replies */}
            {
                isOpen && postType === "GENERAL" &&
                <>
                    <div style={{ margin: "20px 0px 0px 20px" }}>
                        Replies
                    </div>
                    <div style={{display: "flex", flexDirection: "column" }}>
                        <ForumPostCardContent>
                            {mapReplies(childForumPosts)}
                        </ForumPostCardContent>
                    </div>
                </>
            }


            {/* For creating replies */}
            {
                isOpen && myAccount !== undefined &&
                <>
                    <ForumPostCardContent>
                        <ForumAvatar alt="Remy Sharp" src={myAccount.displayPictureUrl} />
                        <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                            RE: {parentForumPost !== undefined ? parentForumPost.message : forumThread?.name}
                            <br />
                            Posting as {myAccount.name}
                        </Typography>
                        <div id="textarea" style={{ margin: "20px", width: "100%" }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Your Reply Here"
                                multiline
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </ForumPostCardContent>
                    <div style={{ marginLeft: "auto", display: "flex" }}>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button primary onClick={handleCreateConfirm}>Post Reply</Button>
                    </div>
                </>

            }

        </>
    )
}

export default ForumPostInputArea


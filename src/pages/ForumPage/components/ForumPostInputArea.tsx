import { useEffect, useState } from 'react';

import {
    IconButton,
    TextField,
    Avatar,
    Typography,
    Divider
} from "@material-ui/core";
import {
    ForumPostCardContent,
    ForumAvatar,
    ForumPostCard,
    ForumPostReplyCard,
    ForumPostReplyCardContent
} from "../ForumElements";
import ReplyIcon from '@material-ui/icons/Reply';
import DeleteIcon from '@material-ui/icons/Delete';
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import { Button } from "../../../values/ButtonElements";
import { ForumPost, CreateNewForumPostReq, CreateNewForumPostReplyReq } from '../../../apis/Entities/ForumPost';
import { ForumThread } from '../../../apis/Entities/ForumThread';
import { createNewForumPost, createNewForumPostReply, deleteForumThread, deleteForumPost } from "../../../apis/Forum/ForumApis";
import { Account } from "../../../apis/Entities/Account";
import { getMyAccount } from "../../../apis/Account/AccountApis";



function ForumPostInputArea(props: any) {

    const [message, setMessage] = useState<string>("");
    const [forumThread, setForumThread] = useState<ForumThread>();
    const [parentForumPost, setParentForumPost] = useState<ForumPost>();
    const [childForumPosts, setChildForumPosts] = useState<ForumPost[]>([]);
    const [currentForumCategoryId, setCurrentForumCategoryId] = useState<number>();
    const [courseId, setCourseId] = useState<number>();
    const [postType, setPostType] = useState<string>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [myAccount, setMyAccount] = useState<Account>();
    const [seeLess, setSeeLess] = useState<boolean>(false);
    const loggedInAccountId = parseInt(window.sessionStorage.getItem("loggedInAccountId"));



    useEffect(() => {
        setForumThread(props.forumThread);
        setParentForumPost(props.forumPost);
        if (props.forumPost != undefined) {
            setChildForumPosts(props.forumPost?.replies);
        }
        setPostType(props.postType);
        setCurrentForumCategoryId(props.currentForumCategoryId);
        setCourseId(props.courseId);
        getMyAccount(loggedInAccountId).then((res) => {
            setMyAccount(res);
        }).catch((err) => {
            console.log("Failed", err);
        });
    }, [props]);

    useEffect(() => {
        console.log("postType", postType);
    }, [postType]);

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
        if (postType === "POST") {
            const createNewForumPostReq: CreateNewForumPostReq = {
                message,
                timeStamp: new Date(),
                accountId: loggedInAccountId,
                forumThreadId: forumThread.forumThreadId
            }
            console.log("createNewForumPostReq", createNewForumPostReq);
            createNewForumPost(createNewForumPostReq)
                .then((res) => {
                    props.onForumPostChange({ message: "Forum Thread Reply Succeeded", type: "success" });
                }).catch((err) => {
                    props.onForumPostChange({ message: err.response.data.message, type: "error" });
                });
        } else if (postType === "REPLY" || postType === "VIEW") {
            const newForumPostReply: ForumPost = {
                forumPostId: null,
                message,
                timeStamp: new Date(),
                reply: null,
                account: myAccount
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
        handleCancel();
    }

    const handleDeletePost = () => {
        if (postType === "POST" && forumThread.account.accountId === loggedInAccountId) {
            //deleting a thread
            props.history.push(`/forum/${courseId}/category/${currentForumCategoryId}`);
            deleteForumThread(forumThread.forumThreadId)
                .then((res) => {
                    props.onForumPostChange({ message: "Forum Thread Deletion Succeeded", type: "success" });
                }).catch((err) => {
                    props.onForumPostChange({ message: err.response.data.message, type: "error" });
                })
        } else if (postType === "REPLY" && parentForumPost.account.accountId === loggedInAccountId) {
            // deleting a post
            deleteForumPost(parentForumPost.forumPostId)
                .then((res) => {
                    props.onForumPostChange({ message: "Forum Post Deletion Succeeded", type: "success" });
                }).catch((err) => {
                    props.onForumPostChange({ message: err.response.data.message, type: "error" });
                })
        } else {
            props.onForumPostChange({ message: "You are not the author of this thread/post.", type: "error" });
        }
    }

    const handleDeleteReply = (forumPost: ForumPost) => {
        if (forumPost.account.accountId === loggedInAccountId) {
            deleteForumPost(forumPost.forumPostId)
                .then((res) => {
                    props.onForumPostChange({ message: "Forum Post Deletion Succeeded", type: "success" });
                }).catch((err) => {
                    props.onForumPostChange({ message: err.response.data.message, type: "error" });
                })
        } else {
            props.onForumPostChange({ message: "You are not the author of this thread/post.", type: "error" });
        }
    }

    const handleSeeReplies = () => {
        setPostType("VIEW");
        handleOpen();
        console.log("handleSeeReplies");
    }

    const handleMakeReply = () => {
        handleOpen();
        console.log("handleMakeReply");
    }

    // const handleSeeLess = () => {
    //     setSeeLess(!seeLess);
    // }

    const mapReplies = (forumPosts: ForumPost[]) => {
        return (
            <div>
                {forumPosts.map(function (post, postId) {
                    return (
                        <>
                            <ForumPostReplyCard key={postId} name={post.forumPostId} elevation={0} variant="outlined">
                                <ForumPostReplyCardContent>
                                    <ForumAvatar alt="Remy Sharp" src={post.account.displayPictureUrl} />
                                    <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                        Posted By {post.account.name} on {formatDate(post.timeStamp)}
                                    </Typography>
                                </ForumPostReplyCardContent>
                                <Divider />
                                <ForumPostReplyCardContent>
                                    <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                                        {post.message}
                                    </Typography>
                                </ForumPostReplyCardContent>
                                <Divider />
                                <IconButton onClick={() => handleDeleteReply(post)} style={{ width: "fit-content", marginInlineStart: "auto", fontSize: "unset" }}>
                                    <DeleteIcon /> Delete
                                </IconButton>
                            </ForumPostReplyCard>
                        </>
                    );
                })}
            </div>
        );
    }


    return (
        <>
            {
                !isOpen &&
                <div style={{ display: "flex" }}>
                    {
                        postType === "REPLY" &&
                        <>
                            <IconButton disabled={childForumPosts.length < 1} onClick={handleSeeReplies} style={{ width: "fit-content", marginInlineStart: "auto", fontSize: "unset" }}>
                                <QuestionAnswerIcon /> {childForumPosts.length} Replies
                            </IconButton>
                            <IconButton onClick={handleMakeReply} style={{ width: "fit-content", fontSize: "unset" }}>
                                <ReplyIcon /> Reply
                            </IconButton>
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
                    <IconButton onClick={handleDeletePost} style={{ width: "fit-content", fontSize: "unset" }}>
                        <DeleteIcon /> Delete
                    </IconButton>
                </div>
            }

            {/* For viewing replies */}
            {
                isOpen && postType === "VIEW" &&
                <>
                    <div style={{ margin: "20px 0px 0px 20px" }}>
                        Replies
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column" }}>
                        <ForumPostCardContent>
                            {mapReplies(childForumPosts)}
                        </ForumPostCardContent>
                    </div>
                </>
            }


            {/* For creating replies */}
            {
                isOpen && myAccount != undefined &&
                <>
                    <ForumPostCardContent>
                        <ForumAvatar alt="Remy Sharp" src={myAccount.displayPictureUrl} />
                        <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
                            RE: {parentForumPost != undefined ? parentForumPost.message : forumThread?.name}
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


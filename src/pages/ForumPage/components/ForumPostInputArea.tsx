import { useEffect, useState } from 'react';

import {
    IconButton,
    TextField,
    Avatar,
    Typography
} from "@material-ui/core";
import {
    ForumPostCardContent,
    ForumAvatar
} from "../ForumElements";
import ReplyIcon from '@material-ui/icons/Reply';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from "../../../values/ButtonElements";
import { ForumPost, CreateNewForumPostReq } from '../../../apis/Entities/ForumPost';
import { createNewForumPost, createNewForumPostReply, deleteForumThread, deleteForumPost } from "../../../apis/Forum/ForumApis";
import { Account } from "../../../apis/Entities/Account";
import { getMyAccount } from "../../../apis/Account/AccountApis";



function ForumPostInputArea(props: any) {

    const [message, setMessage] = useState<string>("");
    const [forumThread, setForumThread] = useState<ForumThread>();
    const [parentForumPost, setParentForumPost] = useState<ForumPost>();
    const [currentForumCategoryId, setCurrentForumCategoryId] = useState<number>();
    const [courseId, setCourseId] = useState<number>();
    const [postType, setPostType] = useState<string>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [myAccount, setMyAccount] = useState<Account>();
    const loggedInAccountId = parseInt(window.sessionStorage.getItem("loggedInAccountId"));



    useEffect(() => {
        setForumThread(props.forumThread);
        setParentForumPost(props.forumPost);
        setPostType(props.postType);
        setCurrentForumCategoryId(props.currentForumCategoryId);
        setCourseId(props.courseId);
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
        setIsOpen(false);
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
        } else if (postType === "REPLY") {
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
                    props.onForumPostChange({ message: "Forum Thread Deletion Succeeded", type: "success" });
                }).catch((err) => {
                    props.onForumPostChange({ message: err.response.data.message, type: "error" });
                })
        } else {
            props.onForumPostChange({ message: "You are not the author of this thread/post.", type: "error" });
        }
        handleCancel();
    }



    return (
        <>
            {
                !isOpen &&
                <div style={{ display: "flex" }}>
                    <IconButton onClick={handleOpen} style={{ width: "fit-content", marginInlineStart: "auto", fontSize: "unset" }}>
                        <ReplyIcon /> Reply
                </IconButton>
                    <IconButton onClick={handleDeletePost} style={{ width: "fit-content", fontSize: "unset" }}>
                        <DeleteIcon /> Delete

                </IconButton>
                </div>
            }

            {
                isOpen && myAccount != undefined &&
                <>
                    <ForumPostCardContent>
                        <ForumAvatar alt="Remy Sharp" src={myAccount.displayPictureUrl} />
                        <Typography variant="body1" component="div" style={{ marginLeft: "20px" }}>
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


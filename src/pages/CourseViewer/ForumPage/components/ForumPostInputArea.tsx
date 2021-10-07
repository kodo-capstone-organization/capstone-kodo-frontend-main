import { useEffect, useState } from 'react';

import {
    IconButton,
    TextField,
    Avatar,
    Typography
} from "@material-ui/core";
import {
    ForumPostCardContent
} from "../ForumElements";
import ReplyIcon from '@material-ui/icons/Reply';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from "../../../values/ButtonElements";
import { ForumPost, CreateNewForumPostReq } from '../../../apis/Entities/ForumPost';
import { createNewForumPost } from "../../../apis/Forum/ForumApis";
import { Account } from "../../../apis/Entities/Account";
import { getMyAccount } from "../../../apis/Account/AccountApis";



function ForumPostInputArea(props: any) {

    const [message, setMessage] = useState<string>("");
    const [forumThread, setForumThread] = useState<ForumThread>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [myAccount, setMyAccount] = useState<Account>();
    const loggedInAccountId = parseInt(window.sessionStorage.getItem("loggedInAccountId"));



    useEffect(() => {
        setForumThread(props.forumThread);
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
        console.log("createNewForumPostReq", forumThread);

        const createNewForumPostReq : CreateNewForumPostReq = {
            message,
            timeStamp : new Date(),
            accountId : loggedInAccountId,
            forumThreadId: forumThread.forumThreadId
        }
        console.log("createNewForumPostReq", createNewForumPostReq);
        createNewForumPost(createNewForumPostReq)
        .then((res) => {
            props.onForumPostChange({ message: "Forum Thread Reply Succeeded", type: "success" });
        }).catch((err) => {
            props.onForumPostChange({ message: "Forum Thread Reply Failed", type: "error" });
            console.log(err.response.data.message);
        });
        handleCancel();
    }


    return (
        <>
            {
                !isOpen &&
                <IconButton onClick={handleOpen} style={{ width: "fit-content", marginInlineStart: "auto", fontSize:"unset" }}>
                    <ReplyIcon /> Reply
                </IconButton>
            }

            {
                isOpen && myAccount != undefined &&
                <>
                    <ForumPostCardContent>
                        <Avatar alt="Remy Sharp" src={myAccount.displayPictureUrl} />
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
                    <div style={{ marginLeft: "auto", display:"flex" }}>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button primary onClick={handleCreateConfirm}>Post Reply</Button>
                    </div>
                </>

            }
        </>
    )
}

export default ForumPostInputArea


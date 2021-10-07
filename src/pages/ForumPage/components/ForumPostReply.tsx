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
import { createNewForumPost, createNewForumPostReply } from "../../../apis/Forum/ForumApis";
import { Account } from "../../../apis/Entities/Account";
import { getMyAccount } from "../../../apis/Account/AccountApis";



function ForumPostReply(props: any) {

    const loggedInAccountId = parseInt(window.sessionStorage.getItem("loggedInAccountId"));

    useEffect(() => {
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
        setIsOpen(false);
    }


    return (
        <>
            {
                !isOpen &&
                <IconButton onClick={handleOpen} style={{ width: "fit-content", marginInlineStart: "auto", fontSize: "unset" }}>
                    <ReplyIcon /> Reply
                </IconButton>
            }

            {
                isOpen &&
                <>
                    <ForumPostCardContent>
                    </ForumPostCardContent>
                </>

            }
        </>
    )
}

export default ForumPostReply


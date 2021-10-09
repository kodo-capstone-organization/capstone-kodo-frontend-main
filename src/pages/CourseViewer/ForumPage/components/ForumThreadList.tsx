import { useEffect, useState } from 'react';

import DeleteIcon from '@material-ui/icons/Delete';
import ForumIcon from '@material-ui/icons/Forum';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
    IconButton, Typography, Avatar, Link,
    Menu, MenuItem, ListItemIcon
} from '@material-ui/core';

import { ForumCategory } from '../../../../apis/Entities/ForumCategory';
import { ForumThread } from '../../../../apis/Entities/ForumThread';

import { getForumCategoryWithForumThreadsOnlyByForumCategoryId as getForumCategoryByForumCategoryId } from "../../../../apis/Forum/ForumApis";
import { getAllForumThreadsByForumCategoryId } from "../../../../apis/Forum/ForumApis";
import { deleteForumThread } from "../../../../apis/Forum/ForumApis";

import {
    ForumCardHeader, ForumCard, ForumThreadCard, 
    ForumThreadCardContent, EmptyStateContainer,
} from "../ForumElements";

import ForumThreadModal from './ForumThreadModal';

import { Button } from "../../../../values/ButtonElements";


function ForumThreadList(props: any) {

    const [courseId, setCourseId] = useState<number>();
    const [forumCategory, setForumCategory] = useState<ForumCategory>();
    const [forumThreads, setForumThreads] = useState<ForumThread[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const loggedInAccountId = JSON.parse(window.sessionStorage.getItem("loggedInAccountId") || "{}");

    const open = Boolean(anchorEl);

    useEffect(() => {
        var forumCategoryId = props.history.location.pathname;
        forumCategoryId = parseInt(forumCategoryId.split('/category/')[1]);
        getForumCategoryByForumCategoryId(forumCategoryId).then((res) => {
            setForumCategory(res);
        }).catch((err) => {
            props.onCallSnackbar({ message: "Failure", type: "error" })
        })
        getAllForumThreadsByForumCategoryId(forumCategoryId).then((res) => {
            setForumThreads(res);
        }).catch((err) => {
            props.onCallSnackbar({ message: "Failure", type: "error" })
        })
        setCourseId(props.courseId)

    }, [props.history.location.pathname]);

    const handleCallSnackbar = (snackbarObject: any) => {
        if (forumCategory !== undefined)
        {
            getForumCategoryByForumCategoryId(forumCategory.forumCategoryId).then((res) => {
                setForumCategory(res);
                setForumThreads(res.forumThreads);
                console.log("new thread", res.forumThreads);
            }).catch((err) => {
                console.log("Failed", err);
            });
            props.onCallSnackbar(snackbarObject);
        }
    }

    const navigateToThread = (forumThreadId: number) => {
        if (forumCategory !== undefined)
        {
            props.history.push(`/forum/${courseId}/category/${forumCategory.forumCategoryId}/thread/${forumThreadId}`);
        }        
    }

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    const sortAtoZ = () => {
        const sorted = forumThreads
            .sort((a, b) => a.name.localeCompare(b.name));
        setForumThreads(sorted);
    }

    const sortZtoA = () => {
        const sorted = forumThreads
            .sort((a, b) => b.name.localeCompare(a.name));
        setForumThreads(sorted);
    }

    const sortNewestFirst = () => {
        console.log("1")
        const sorted = forumThreads
            .sort((a, b) => {
                return +(new Date(a.timeStamp)) - +(new Date(b.timeStamp))
            });
        setForumThreads(sorted);
    }

    const sortOldestFirst = () => {
        console.log("2")
        const sorted = forumThreads
            .sort((a, b) => {
                return +(new Date(b.timeStamp)) - +(new Date(a.timeStamp))
            });
        setForumThreads(sorted);
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteThread = (forumThread : ForumThread) => {
        if(forumThread.account.accountId === loggedInAccountId){
            deleteForumThread(forumThread.forumThreadId)
            .then((res) => {
                props.onCallSnackbar({ message: "Thread Deleted Successfully", type: "success" })
            }).catch((err) => {
                props.onCallSnackbar({ message: err.response.data.message , type: "error" })
            })
        }
    }

    const mapThreads = (forumThreads: ForumThread[]) => {
        return (
            <div>
                {forumThreads.map(function (thread, threadId) {
                    return (
                        <>
                            <ForumThreadCard key={threadId}>
                                <Avatar alt="Remy Sharp" src={thread.account.displayPictureUrl} />
                                <Typography variant="body1" component="div" style={{ marginLeft: "20px", width: "500px" }}>
                                    <Link onClick={() => navigateToThread(thread.forumThreadId)}>{thread.name}</Link>
                                    <br />
                                    {formatDate(thread.timeStamp)}  |  {thread.account.name}
                                </Typography>
                                <Typography variant="body1" component="div" style={{ marginRight: "auto" }}>
                                    {thread.forumPosts.length} Replies
                                <ForumIcon />
                                </Typography>
                                <IconButton
                                    id="basic-button"
                                    aria-controls="basic-menu"
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleMenuOpen}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleMenuClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem>
                                        <ListItemIcon onClick={() => handleDeleteThread(thread)}>
                                            <DeleteIcon /> Delete Category
                                        </ListItemIcon>
                                    </MenuItem>
                                </Menu>
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
                        <>
                            <Button onClick={sortAtoZ}>Sort A to Z</Button>
                            <Button onClick={sortZtoA}>Sort Z to A</Button>
                            <Button onClick={sortOldestFirst}>Sort Old to New</Button>
                            <Button onClick={sortNewestFirst}>Sort New to Old</Button>
                            <ForumThreadModal modalType={"CREATE"} courseId={props.courseId} forumCategory={forumCategory} onForumThreadChange={handleCallSnackbar} />
                        </>
                    }
                />
            }

            <ForumThreadCardContent>
                {mapThreads(forumThreads)}
                <EmptyStateContainer threadsExist={forumThreads.length > 0}>
                    <Typography>No threads currently 🥺</Typography>
                    <ForumThreadModal modalType={"EMPTY"} courseId={props.courseId} forumCategory={forumCategory} onForumThreadChange={handleCallSnackbar} />
                </EmptyStateContainer>
            </ForumThreadCardContent>
        </ForumCard>
    );
}

export default ForumThreadList
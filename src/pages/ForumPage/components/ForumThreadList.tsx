import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { getForumCategoryByForumCategoryId, deleteForumThread } from "../../../apis/Forum/ForumApis";
import { ForumCategory } from '../../../apis/Entities/ForumCategory';

import {
    ForumContainer, ForumCardHeader, ForumCardContent, ForumCard,
    ForumThreadCard, ForumThreadCardContent, EmptyStateContainer,
    EmptyStateText, ForumAvatar, ForumButton
} from "../ForumElements";
import {
    IconButton, Typography, Avatar, Link,
    Menu, MenuItem, ListItemIcon, CircularProgress
} from '@material-ui/core';
import ForumIcon from '@material-ui/icons/Forum';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';


import ForumThreadModal from './ForumThreadModal';
import { ForumThread } from '../../../apis/Entities/ForumThread';


function ForumThreadList(props: any) {

    const [courseId, setCourseId] = useState<number>();
    const [forumCategory, setForumCategory] = useState<ForumCategory>();
    const [forumThreads, setForumThreads] = useState<ForumThread[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const loggedInAccountId = parseInt(window.sessionStorage.getItem("loggedInAccountId"));
    const [menuInfo, setMenuInfo] = useState<any>();
    const [loading, setLoading] = useState<boolean>();


    const open = Boolean(anchorEl);

    useEffect(() => {
        setLoading(true);
        if (props.currentForumCategoryId != undefined) {
            getForumCategoryByForumCategoryId(props.currentForumCategoryId).then((res) => {
                setForumCategory(res);
                setForumThreads(res.forumThreads);
                setLoading(false);
            }).catch((err) => {
                props.onCallSnackbar({ message: "Failure here", type: "error" })
            })
        }
        setCourseId(props.currentCourseId);
    }, [props]);

    const handleCallSnackbar = (snackbarObject: any) => {
        getForumCategoryByForumCategoryId(forumCategory.forumCategoryId).then((res) => {
            setForumCategory(res);
            setForumThreads(res.forumThreads);
            console.log("new thread", res.forumThreads);
        }).catch((err) => {
            console.log("Failed", err);
        });
        props.onCallSnackbar(snackbarObject);
    }

    const navigateToThread = (forumThreadId: number) => {
        props.history.push(`/forum/${courseId}/category/${forumCategory.forumCategoryId}/thread/${forumThreadId}`);
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

    const sortOldestFirst = () => {
        const sorted = forumThreads
            .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        setForumThreads(sorted);
    }

    const sortNewestFirst = () => {
        const sorted = forumThreads
            .sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
        console.log("Sorted", sorted);
        setForumThreads(sorted);
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, forumThreadId: number, accountId: number) => {
        setAnchorEl(event.currentTarget);
        setMenuInfo({ forumThreadId, accountId });
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuInfo(null);
    };

    const handleDeleteThread = () => {
        console.log("forumThread", menuInfo);
        if (menuInfo.accountId === loggedInAccountId) {
            deleteForumThread(menuInfo.forumThreadId)
                .then((res) => {
                    props.onCallSnackbar({ message: "Thread Deleted Successfully", type: "success" })
                    getForumCategoryByForumCategoryId(forumCategory.forumCategoryId).then((res) => {
                        setForumCategory(res);
                        setForumThreads(res.forumThreads);
                    }).catch((err) => {
                        props.onCallSnackbar({ message: "Failure", type: "error" })
                    })
                }).catch((err) => {
                    props.onCallSnackbar({ message: err.response.data.message, type: "error" })

                })
        } else {
            props.onCallSnackbar({ message: "You are not the author of this thread", type: "error" })
        }
    }

    const mapThreads = (forumThreads: ForumThread[]) => {
        return (
            <div>
                {forumThreads.map(function (thread, threadId) {
                    return (
                        <>
                            <ForumThreadCard key={thread.forumThreadId}>
                                <ForumAvatar alt="Remy Sharp" src={thread.account.displayPictureUrl} />
                                <Typography variant="body1" component="div" style={{ marginLeft: "20px", width: "500px" }}>
                                    <Link onClick={() => navigateToThread(thread.forumThreadId)}>{thread.name}</Link>
                                    <br />
                                    {formatDate(thread.timeStamp)}  |  {thread.account.name}
                                </Typography>
                                <Typography variant="body1" component="div" style={{ marginRight: "auto" }}>
                                    {thread.forumPosts.length} Replies
                                <ForumIcon />
                                </Typography>
                                <div>
                                    <IconButton
                                        id="basic-button"
                                        aria-controls="basic-menu"
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={(e) => handleMenuOpen(e, thread.forumThreadId, thread.account.accountId)}
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
                                            <ListItemIcon onClick={handleDeleteThread}>
                                                <DeleteIcon /> Delete
                                        </ListItemIcon>
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </ForumThreadCard>
                        </>
                    );
                })}
            </div>
        );
    }


    if(loading){
        return (
            <ForumCard>
                {
                    < ForumCardHeader
                        title="Loading ..."
                        action={
                            <>
                                <ForumButton onClick={sortAtoZ}>Sort A to Z</ForumButton>
                                <ForumButton onClick={sortZtoA}>Sort Z to A</ForumButton>
                                <ForumButton onClick={sortOldestFirst}>Sort Old to New</ForumButton>
                                <ForumButton onClick={sortNewestFirst}>Sort New to Old</ForumButton>
                                <ForumThreadModal modalType={"CREATE"} courseId={props.courseId} forumCategory={forumCategory} onForumThreadChange={handleCallSnackbar} />
                            </>
                        }
                    />
                }
    
                <ForumThreadCardContent>
                    <CircularProgress/>
                </ForumThreadCardContent>
            </ForumCard>
        );
    }else{
        return (
            <ForumCard>
                {
                    forumCategory !== undefined &&
                    < ForumCardHeader
                        title={forumCategory.name}
                        action={
                            <>
                                <ForumButton onClick={sortAtoZ}>Sort A to Z</ForumButton>
                                <ForumButton onClick={sortZtoA}>Sort Z to A</ForumButton>
                                <ForumButton onClick={sortOldestFirst}>Sort Old to New</ForumButton>
                                <ForumButton onClick={sortNewestFirst}>Sort New to Old</ForumButton>
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

}

export default ForumThreadList
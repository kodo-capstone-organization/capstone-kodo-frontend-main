import { useEffect, useState } from 'react';

import ForumIcon from '@material-ui/icons/Forum';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    IconButton, Typography, Link, Menu,
    MenuItem, ListItemIcon, CircularProgress, OutlinedInput
} from '@material-ui/core';

import { ForumCategory } from '../../../apis/Entities/ForumCategory';
import { ForumThread } from '../../../apis/Entities/ForumThread';
import { Course } from '../../../apis/Entities/Course';

import {
    getForumCategoryWithForumThreadsOnlyByForumCategoryId as getForumCategoryByForumCategoryId,
    getAllForumThreadsByForumCategoryId,
    deleteForumThread
} from "../../../apis/Forum/ForumApis";

import {
    ForumCardHeader, ForumCard, ForumThreadCard,
    ForumThreadCardContent, EmptyStateContainer,
    ForumAvatar, ForumButton, ForumTextField
} from "../ForumElements";

import ForumThreadModal from './ForumThreadModal';
import { getCourseByCourseId } from '../../../apis/Course/CourseApis';


function ForumThreadList(props: any) {

    const [courseId, setCourseId] = useState<number>();
    const [course, setCourse] = useState<Course>();
    const [forumCategory, setForumCategory] = useState<ForumCategory>();
    const [forumThreads, setForumThreads] = useState<ForumThread[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuInfo, setMenuInfo] = useState<any>();
    const [loading, setLoading] = useState<boolean>();
    const [sortAlphabet, setSortAlphabet] = useState<boolean>(true);
    const [searchValue, setSearchValue] = useState<string>("");


    const loggedInAccountId = JSON.parse(window.sessionStorage.getItem("loggedInAccountId") || "{}");

    const open = Boolean(anchorEl);

    useEffect(() => {
        setLoading(true);
        if (props.currentForumCategoryId != undefined) {
            console.log('props here in thread list');
            getForumCategoryByForumCategoryId(props.currentForumCategoryId).then((res) => {
                setForumCategory(res);
            }).catch((err) => {
                props.onCallSnackbar({ message: "Failure here", type: "error" })
            })
            getAllForumThreadsByForumCategoryId(props.currentForumCategoryId).then((res) => {
                setForumThreads(res);
                setLoading(false);
            }).catch((err) => {
                props.onCallSnackbar({ message: "Failure here", type: "error" })
            })
        }
        setCourseId(props.currentCourseId);
        getCourseByCourseId(props.currentCourseId).then((res) => {
            setCourse(res);
        }).catch((err) => {
            props.onCallSnackbar({ message: "Failure here", type: "error" })
        })
    }, [props.currentForumCategoryId]);

    const handleCallSnackbar = (snackbarObject: any) => {
        if (forumCategory !== undefined) {
            if (snackbarObject.type === "success") {
                getForumCategoryByForumCategoryId(forumCategory.forumCategoryId).then((res) => {
                    setForumCategory(res);
                    setForumThreads(res.forumThreads);
                    console.log("new thread", res.forumThreads);
                }).catch((err) => {
                    console.log("Failed", err);
                });
            }
            props.onCallSnackbar(snackbarObject);
        }
    }

    const navigateToThread = (forumThreadId: number) => {
        if (forumCategory !== undefined) {
            props.history.push(`/overview/course/${courseId}/forum/category/${forumCategory.forumCategoryId}/thread/${forumThreadId}`);
        }
    }

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    const sortAtoZ = () => {
        if (sortAlphabet) {
            const sorted = forumThreads
                .sort((a, b) => a.name.localeCompare(b.name));
            setForumThreads(sorted);
        } else {
            const sorted = forumThreads
                .sort((a, b) => b.name.localeCompare(a.name));
            setForumThreads(sorted);
        }
        setSortAlphabet(!sortAlphabet);
    }

    const filterByNameDescAuthor = (search: string) => {
        search = search.toLowerCase();
        if (search != "") {
            const sorted = forumThreads
                .filter((thread) => thread.name.toLowerCase().includes(search) 
                || thread.description.toLowerCase().includes(search) 
                || thread.account.name.toLowerCase().includes(search));
            setForumThreads(sorted);
        } else {
            getAllForumThreadsByForumCategoryId(props.currentForumCategoryId).then((res) => {
                setForumThreads(res);
            }).catch((err) => {
                props.onCallSnackbar({ message: "Failure here", type: "error" })
            })
        }
        setSearchValue(search);
    }

    const sortNewestFirst = () => {
        const sorted = forumThreads
            .sort((a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime());
        setForumThreads(sorted);
    }

    const sortOldestFirst = () => {
        const sorted = forumThreads
            .sort((a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime());
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
        if (forumCategory !== undefined) {
            if (menuInfo.accountId === loggedInAccountId || course?.tutor.accountId === loggedInAccountId) {
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
    }

    const mapThreads = (forumThreads: ForumThread[]) => {
        return (
            <div>
                <ForumTextField placeholder="Search By Name, Description, Author..." id="mytextfield" value={searchValue} variant="outlined"
                    onChange={(e) => filterByNameDescAuthor(e.target.value)}  style={{width:"500px"}}/>
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


    if (loading) {
        return (
            <ForumCard>
                {
                    < ForumCardHeader
                        title="Loading ..."
                        action={
                            <>
                                <ForumButton onClick={sortAtoZ}><SortByAlphaIcon /></ForumButton>
                                <ForumButton onClick={sortOldestFirst}>Sort Old to New</ForumButton>
                                <ForumButton onClick={sortNewestFirst}>Sort New to Old</ForumButton>
                                <ForumThreadModal modalType={"CREATE"} courseId={props.courseId} forumCategory={forumCategory} onForumThreadChange={handleCallSnackbar} />
                            </>
                        }
                    />
                }

                <ForumThreadCardContent>
                    <CircularProgress />
                </ForumThreadCardContent>
            </ForumCard>
        );
    } else {
        return (
            <ForumCard>
                {
                    forumCategory !== undefined &&
                    < ForumCardHeader
                        title={forumCategory.name}
                        action={
                            <>
                                <ForumButton onClick={sortAtoZ}><SortByAlphaIcon /></ForumButton>
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
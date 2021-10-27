import { useEffect, useState } from 'react';

import ForumIcon from '@material-ui/icons/Forum';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    IconButton, Typography, Link, Menu,
    MenuItem, ListItemIcon, CircularProgress
} from '@material-ui/core';

import { ForumCategory } from '../../../entities/ForumCategory';
import { ForumThread } from '../../../entities/ForumThread';
import { Course } from '../../../entities/Course';

import {
    getForumCategoryWithForumThreadsOnlyByForumCategoryId as getForumCategoryByForumCategoryId,
    getAllForumThreadsByForumCategoryId,
    deleteForumThread
} from "../../../apis/ForumApis";

import {
    ForumCardHeader, ForumCard, ForumThreadCard,
    ForumThreadCardContent, EmptyStateContainer,
    ForumAvatar, ForumButton, ForumTextField
} from "../ForumElements";

import ForumThreadModal from './ForumThreadModal';
import { getCourseByCourseId } from '../../../apis/CourseApis';


function ForumThreadList(props: any) {

    const [courseId, setCourseId] = useState<number>();
    const [course, setCourse] = useState<Course>();
    const [forumCategory, setForumCategory] = useState<ForumCategory>();
    const [forumThreads, setForumThreads] = useState<ForumThread[]>([]);
    const [forumThreadsOriginal, setForumThreadsOriginal] = useState<ForumThread[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuInfo, setMenuInfo] = useState<any>();
    const [loading, setLoading] = useState<boolean>();
    const [sortAlphabet, setSortAlphabet] = useState<boolean>(true);
    const [searchValue, setSearchValue] = useState<string>("");


    const loggedInAccountId = JSON.parse(window.sessionStorage.getItem("loggedInAccountId") || "{}");

    const open = Boolean(anchorEl);

    useEffect(() => {
        console.log("props", props);
        setLoading(true);
        if (props.currentForumCategoryId !== undefined) {
            getForumCategoryByForumCategoryId(props.currentForumCategoryId).then((res) => {
                setForumCategory(res);
            }).catch((err) => {
                props.onCallSnackbar({ message: "Failure here", type: "error" })
            })
            getAllForumThreadsByForumCategoryId(props.currentForumCategoryId).then((res) => {
                setForumThreads(res);
                setForumThreadsOriginal(res);
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
        if (search !== "") {
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

    const handleCallSnackbar = (snackbarObject: any) => {
        setLoading(true);
        if (forumCategory && forumCategory.forumCategoryId !== null) {
            if (snackbarObject.type === "success") {
                getForumCategoryByForumCategoryId(forumCategory.forumCategoryId).then((res) => {
                    setForumCategory(res);
                    setForumThreads(res.forumThreads);
                    setForumThreadsOriginal(res.forumThreads);
                }).catch((err) => {
                    console.log("Failed", err);
                });
                getAllForumThreadsByForumCategoryId(forumCategory.forumCategoryId).then((res) => {
                    setForumThreads(res);
                    setLoading(false);
                }).catch((err) => {
                    props.onCallSnackbar({ message: "Failure here", type: "error" })
                })
            } else {
                setLoading(false);
            }
        }
        props.onCallSnackbar(snackbarObject);
    }


    const mapThreads = (forumThreads: ForumThread[]) => {
        return (
            <div>
                {forumThreads.map(function (thread, threadId) {
                    return (
                        <>
                            {
                                <ForumThreadCard key={threadId}>
                                    <ForumAvatar alt="Remy Sharp" src={thread.account.displayPictureUrl} />
                                    <Typography variant="body1" component="div" style={{ marginLeft: "20px", width: "500px" }}>
                                        <Link onClick={() => navigateToThread(thread.forumThreadId)}>{thread.name}</Link>
                                        <br />
                                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", width: '400px' }}>
                                            <Typography variant="caption">
                                                {thread.description}
                                            </Typography>
                                        </div>
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
                                                <ForumThreadModal modalType={"DELETE"} menuInfo={menuInfo} courseId={course?.courseId} forumCategory={forumCategory} onForumThreadChange={handleCallSnackbar} handleMenuClose={handleMenuClose} />
                                            </MenuItem>
                                        </Menu>
                                    </div>
                                </ForumThreadCard>
                            }
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
                                <ForumThreadModal modalType={"CREATE"} courseId={course?.courseId} forumCategory={forumCategory} onForumThreadChange={handleCallSnackbar} />
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
                                <ForumThreadModal modalType={"CREATE"} courseId={course?.courseId} forumCategory={forumCategory} onForumThreadChange={handleCallSnackbar} />
                            </>
                        }
                    />
                }

                <ForumThreadCardContent>
                    <div>
                        <ForumTextField placeholder="Search By Name, Description, Author..." id="mytextfield" value={searchValue} variant="outlined"
                            onChange={(e: any) => filterByNameDescAuthor(e.target.value)} style={{ width: "500px" }} />
                    </div>
                    {/* previous runtime error was caused here when threads were mapped when length = 0 */}
                    {
                        forumThreads.length > 0 &&
                        mapThreads(forumThreads)
                    }
                    <EmptyStateContainer threadsExist={forumThreadsOriginal.length > 0}>
                        <Typography>No threads currently 🥺</Typography>
                        <ForumThreadModal modalType={"EMPTY"} courseId={course?.courseId} forumCategory={forumCategory} onForumThreadChange={handleCallSnackbar} />
                    </EmptyStateContainer>
                </ForumThreadCardContent>
            </ForumCard>
        );
    }

}

export default ForumThreadList
import { useEffect, useState } from 'react';

import ForumIcon from '@material-ui/icons/Forum';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
    Typography, Link, CircularProgress,
    IconButton, Menu, MenuItem
} from '@material-ui/core';

import { ForumCategory } from '../../../apis/Entities/ForumCategory';
import { getAllForumCategoriesWithForumThreadsOnlyByCourseId as getAllForumCategoriesByCourseId } from "../../../apis/Forum/ForumApis";
import { getCourseByCourseId } from '../../../apis/Course/CourseApis';

import {
    ForumCardHeader, ForumCardContent, ForumCard,
    ForumThreadCard, EmptyStateContainer,
} from "../ForumElements";

import ForumCategoryModal from './ForumCategoryModal';


function ForumCategoryList(props: any) {

    const [courseId, setCourseId] = useState<number>();
    const [forumCategories, setForumCategories] = useState<ForumCategory[]>([]);
    const [actionsDisabled, setActionsDisabled] = useState<boolean>(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loading, setLoading] = useState<boolean>();
    const [menuInfo, setMenuInfo] = useState<any>();

    const loggedInAccountId = JSON.parse(window.sessionStorage.getItem("loggedInAccountId") || "{}");
    const open = Boolean(anchorEl);

    useEffect(() => {
        setLoading(true);
        console.log("loading", true);
        setCourseId(props.currentCourseId)
        getCourseByCourseId(props.currentCourseId).then((res) => {
            if (loggedInAccountId != null && res.tutor.accountId === loggedInAccountId) {
                setActionsDisabled(false);
            }
        })
        getAllForumCategoriesByCourseId(props.currentCourseId).then((res) => {
            res.map((q) => {
                Object.assign(q, { id: q.forumCategoryId })
                return q;
            });

            setForumCategories(res);
            setLoading(false);
        }).catch((err) => {
            console.log("Failed", err);
        })
        console.log("loading", false);
    }, [props.currentCourseId]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, category: ForumCategory) => {
        setAnchorEl(event.currentTarget);
        setMenuInfo(category);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCallSnackbar = (snackbarObject: any) => {
        if (courseId !== undefined) {
            if (snackbarObject.type === "success") {
                getAllForumCategoriesByCourseId(courseId).then((res) => {
                    res.map((q) => {
                        Object.assign(q, { id: q.forumCategoryId })
                        return q;
                    });
                    setForumCategories(res);
                }).catch((err) => {
                    console.log("Failed", err);
                });
            }
            props.onCallSnackbar(snackbarObject);
        }
    }

    const navigateToIndividualCategory = (forumCategoryId: number | null) => {
        if (forumCategoryId !== null) {
            props.history.push(`/overview/course/${props.currentCourseId}/forum/category/${forumCategoryId}`);
        }
    }

    const mapCategories = (forumCategories: ForumCategory[]) => {
        return (
            <div>
                {forumCategories.map(function (category, categoryId) {
                    return (
                        <>
                            <ForumThreadCard key={categoryId}>
                                <Typography variant="body1" component="div" style={{ marginLeft: "20px", width: "500px" }}>
                                    <Link onClick={() => navigateToIndividualCategory(category.forumCategoryId)}>{category.name}</Link>
                                </Typography>
                                <Typography variant="body1" component="div" style={{ marginRight: "auto" }}>
                                    {category.forumThreads?.length} Threads
                                    <ForumIcon />
                                </Typography>
                                <>
                                    <IconButton
                                        id="basic-button"
                                        aria-controls="basic-menu"
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={(e) => handleMenuOpen(e, category)}
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
                                        {
                                            !actionsDisabled &&
                                            <>
                                                <MenuItem >
                                                    <ForumCategoryModal modalType={"EDIT"} courseId={props.courseId} onForumCategoryChange={handleCallSnackbar} forumCategory={menuInfo} />
                                                </MenuItem>
                                                <MenuItem >
                                                    <ForumCategoryModal modalType={"DELETE"} courseId={props.courseId} onForumCategoryChange={handleCallSnackbar} forumCategory={menuInfo} />
                                                </MenuItem>
                                            </>
                                        }
                                        {/* <MenuItem >
                                            <ForumCategoryModal modalType={"REPORT"} courseId={props.courseId} onForumCategoryChange={handleCallSnackbar} forumCategory={menuInfo} />
                                        </MenuItem> */}
                                    </Menu>
                                </>
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
                <ForumCardHeader
                    title="Forum Discussion Categories"
                    action={
                        !actionsDisabled &&
                        <ForumCategoryModal modalType={"CREATE"} courseId={courseId} onForumCategoryChange={handleCallSnackbar} />
                    }
                />
                <ForumCardContent>
                    <CircularProgress />
                </ForumCardContent>
            </ForumCard>
        );
    } else {
        return (
            <ForumCard>
                <ForumCardHeader
                    title="Forum Discussion Categories"
                    action={
                        !actionsDisabled &&
                        <ForumCategoryModal modalType={"CREATE"} courseId={courseId} onForumCategoryChange={handleCallSnackbar} />
                    }
                />
                <ForumCardContent>
                    {mapCategories(forumCategories)}
                    <EmptyStateContainer threadsExist={forumCategories.length > 0}>
                        <Typography>No Categories Created 🥺</Typography>
                        <ForumCategoryModal modalType={"EMPTY"} courseId={courseId} onForumCategoryChange={handleCallSnackbar} />
                    </EmptyStateContainer>
                </ForumCardContent>
            </ForumCard>
        );
    }
}

export default ForumCategoryList
import { useEffect, useState } from 'react';
// import { useHistory } from "react-router-dom";

import { getForumCategoryByCourseId } from "../../../apis/Forum/ForumApis";
import { ForumCategory } from '../../../apis/Entities/ForumCategory';

import {
    ForumCardHeader, ForumCardContent, ForumCard,
    ForumThreadCard, EmptyStateContainer,
} from "../ForumElements";
import { Button } from "../../../values/ButtonElements";
import ForumIcon from '@material-ui/icons/Forum';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
    Typography, Link,
    IconButton, Menu, MenuItem
} from '@material-ui/core';

import ForumCategoryModal from './ForumCategoryModal';
import { getCourseByCourseId } from '../../../apis/Course/CourseApis';

function ForumCategoryList(props: any) {

    const [courseId, setCourseId] = useState<number>();
    const [forumCategories, setForumCategories] = useState<ForumCategory[]>([]);
    const [actionsDisabled, setActionsDisabled] = useState<boolean>(true);
    const loggedInAccountId = parseInt(window.sessionStorage.getItem("loggedInAccountId"));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);



    const open = Boolean(anchorEl);

    useEffect(() => {
        setCourseId(props.courseId)
        getCourseByCourseId(props.courseId).then((res) => {
            // removing action access from students
            console.log("getCourseByCourseId", res);
            if (loggedInAccountId != null && res.tutor.accountId === loggedInAccountId) {
                setActionsDisabled(false);
            }
        })
        getForumCategoryByCourseId(props.courseId).then((res) => {
            res.map((q) => {
                Object.assign(q, { id: q.forumCategoryId })
                return q;
            });
            setForumCategories(res);
        }).catch((err) => {
            console.log("Failed", err);
        })
    }, [props.courseId]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCallSnackbar = (snackbarObject: any) => {
        getForumCategoryByCourseId(props.courseId).then((res) => {
            res.map((q) => {
                Object.assign(q, { id: q.forumCategoryId })
                return q;
            });
            setForumCategories(res);
        }).catch((err) => {
            console.log("Failed", err);
        });
        props.onCallSnackbar(snackbarObject);
    }

    const navigateToIndividualCategory = (forumCategoryId: number) => {
        props.history.push(`/forum/${courseId}/category/${forumCategoryId}`);
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
                                    {category.forumThreads.length} Threads
                                <ForumIcon />
                                </Typography>
                                {
                                    !actionsDisabled &&
                                    <>
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
                                                <ForumCategoryModal modalType={"EDIT"} courseId={props.courseId} onForumCategoryChange={handleCallSnackbar} forumCategory={category} />
                                            </MenuItem>
                                            <MenuItem>
                                                <ForumCategoryModal modalType={"DELETE"} courseId={props.courseId} onForumCategoryChange={handleCallSnackbar} forumCategory={category} />
                                            </MenuItem>
                                        </Menu>
                                    </>
                                }

                            </ForumThreadCard>
                        </>
                    );
                })}
            </div>
        );
    }

    return (
        <ForumCard>
            <ForumCardHeader
                title="Forum Discussion"
                action={
                    !actionsDisabled &&
                    <ForumCategoryModal modalType={"CREATE"} courseId={props.courseId} onForumCategoryChange={handleCallSnackbar} />
                }
            />
            <ForumCardContent>
                {mapCategories(forumCategories)}
                <EmptyStateContainer threadsExist={forumCategories.length > 0}>
                    <Typography>No Categories Created 🥺</Typography>
                    <ForumCategoryModal modalType={"EMPTY"} courseId={props.courseId} onForumCategoryChange={handleCallSnackbar} />
                </EmptyStateContainer>
            </ForumCardContent>
        </ForumCard>
    );
}

export default ForumCategoryList
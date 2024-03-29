import { useEffect, useState } from 'react';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import FlagIcon from '@material-ui/icons/Flag';
import { Button } from "../../../values/ButtonElements";
import { deleteForumPost, updateForumPost } from "../../../apis/ForumApis";
import { ForumPost, UpdateForumPostReq } from "../../../entities/ForumPost";
import { Course } from '../../../entities/Course';


function ForumPostModal(props: any) {

    const [open, setOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<string>();
    const [forumPost, setForumPost] = useState<ForumPost>();
    const [currentCourse, setCurrentCourse] = useState<Course>();
    const [reasonForReport, setReasonForReport] = useState<string>("");
    const [isFormError, setIsFormError] = useState<boolean>(false);
    const [isDisplayed, setIsDisplayed] = useState<boolean>(false);

    const loggedInAccountId = JSON.parse(window.sessionStorage.getItem("loggedInAccountId") || "{}");


    useEffect(() => {
        setCurrentCourse(props.currentCourse);
        setModalType(props.modalType);
        if (props.forumPost !== undefined) {
            setForumPost(props.forumPost);
            setIsDisplayed(props.forumPost.account.accountId === loggedInAccountId || props.currentCourse.tutor.accountId === loggedInAccountId);
        }
    }, [props, open])

    const handleOpen = () => {
        setOpen(true);
        setIsFormError(false);
        setReasonForReport("");
    };

    const handleClose = () => {
        setOpen(false);
        setIsFormError(false);
        setReasonForReport("");
    };

    const handleDeleteConfirm = () => {
        if (forumPost !== undefined && forumPost.forumPostId !== null) {
            if (forumPost.account.accountId === loggedInAccountId || currentCourse?.tutor.accountId === loggedInAccountId) {
                deleteForumPost(forumPost.forumPostId)
                    .then((res) => {
                        props.onForumPostChange({ message: "Forum Post Deletion Succeeded", type: "success" });
                    }).catch((err) => {
                        props.onForumPostChange({ message: err.response.data.message, type: "error" });
                    })
            } else {
                props.onForumPostChange({ message: "You are not the author of this thread/post.", type: "error" });
            }
        } else {
            props.onForumPostChange({ message: "Error deleting forum post.", type: "error" });
        }
        handleClose();
    }

    const handleReportConfirm = () => {
        if (reasonForReport.length === 0) {
            const isReasonEmpty = reasonForReport.length === 0;
            setIsFormError(isReasonEmpty);
        } else if (forumPost !== undefined) {
            const updateForumPostReq: UpdateForumPostReq = {
                forumPost,
                reasonForReport
            }
            console.log("forumPostToSubmit", updateForumPostReq)
            updateForumPost(updateForumPostReq).then((res) => {
                props.onForumPostChange({ message: "Forum Post Report Succeeded", type: "success" });
            }).catch((err) => {
                props.onForumPostChange({ message: "Forum Post Report Failed", type: "error" });
            })
            handleClose();
        }
    }

    return (
        <>

            {
                modalType === "REPORTREPLY" &&
                <>
                    <IconButton onClick={handleOpen} style={{ width: "fit-content", marginInlineStart: "auto", fontSize: "unset" }}>
                        <FlagIcon /> Report
                    </IconButton>
                    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
                        <DialogTitle>Report Forum Post</DialogTitle>
                        <form>
                            <DialogContent>
                                Are you sure you want to report: {forumPost?.message}?
                            </DialogContent>
                            <DialogContent>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    required
                                    label="Reason For Report"
                                    value={reasonForReport}
                                    variant="outlined"
                                    onChange={(e) => setReasonForReport(e.target.value)}
                                    error={isFormError}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button primary onClick={handleReportConfirm}>Confirm</Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                </>
            }

            {
                modalType === "DELETEREPLY" && isDisplayed &&
                <>
                    <IconButton onClick={handleOpen} style={{ width: "fit-content", fontSize: "unset" }}>
                        <DeleteIcon /> Delete
                    </IconButton>
                    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
                        <DialogTitle>Delete Forum Post</DialogTitle>
                        <DialogContent>
                            Are you sure you want to delete this post: {forumPost?.message}?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button primary onClick={handleDeleteConfirm}>Confirm</Button>
                        </DialogActions>
                    </Dialog>
                </>
            }

            {
                modalType === "REPORTPARENTPOST" &&
                <>
                    <IconButton onClick={handleOpen} style={{ width: "fit-content", fontSize: "unset" }}>
                        <FlagIcon /> Report
                    </IconButton>
                    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
                        <DialogTitle>Report Forum Post</DialogTitle>
                        <form>
                            <DialogContent>
                                Are you sure you want to report: {forumPost?.message}?
                            </DialogContent>
                            <DialogContent>
                                <TextField
                                    fullWidth
                                    required
                                    multiline
                                    rows={4}
                                    label="Reason For Report"
                                    value={reasonForReport}
                                    variant="outlined"
                                    onChange={(e) => setReasonForReport(e.target.value)}
                                    error={isFormError}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button primary onClick={handleReportConfirm}>Confirm</Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                </>
            }

            {
                modalType === "DELETEPARENTPOST" && isDisplayed &&
                <>
                    <IconButton onClick={handleOpen} style={{ width: "fit-content", fontSize: "unset" }}>
                        <DeleteIcon /> Delete
                    </IconButton>
                    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
                        <DialogTitle>Delete Forum Thread</DialogTitle>
                        <DialogContent>
                            Are you sure you want to delete this thread: {forumPost?.message}?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button primary onClick={handleDeleteConfirm}>Confirm</Button>
                        </DialogActions>
                    </Dialog>
                </>
            }

        </>
    )
}

export default ForumPostModal


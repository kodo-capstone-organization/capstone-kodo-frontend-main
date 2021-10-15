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
import { deleteForumPost, updateForumPost } from "../../../apis/Forum/ForumApis";
import { ForumPost, UpdateForumPostReq } from "../../../apis/Entities/ForumPost";


function ForumPostModal(props: any) {

    const [open, setOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<string>();
    const [forumPost, setForumPost] = useState<ForumPost>();
    const [reasonForReport, setReasonForReport] = useState<string>("");

    const loggedInAccountId = JSON.parse(window.sessionStorage.getItem("loggedInAccountId") || "{}");


    useEffect(() => {
        // setCourseId(props.courseId);
        setModalType(props.modalType);
        if (props.forumPost !== undefined) {
            setForumPost(props.forumPost);
        }
        // if (props.forumThread !== undefined) {
        //     setForumThread(props.forumThread);
        // }
    }, [props, open])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (forumPost !== undefined && forumPost.account.accountId === loggedInAccountId && forumPost.forumPostId !== null) {
            deleteForumPost(forumPost.forumPostId)
                .then((res) => {
                    props.onForumPostChange({ message: "Forum Post Deletion Succeeded", type: "success" });
                }).catch((err) => {
                    props.onForumPostChange({ message: err.response.data.message, type: "error" });
                })
        } else {
            props.onForumPostChange({ message: "You are not the author of this thread/post.", type: "error" });
        }
    }

    const handleReportConfirm = () => {
        if (forumPost !== undefined) {
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
        }
        setReasonForReport("");
        setOpen(false);
    }

    return (
        <>
            {
                modalType === "DELETEREPLY" &&
                <>
                    <IconButton onClick={handleOpen} style={{ width: "fit-content", marginInlineStart: "auto", fontSize: "unset" }}>
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
                modalType === "REPORTREPLY" &&
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
                                    multiline
                                    rows={4}
                                    required
                                    label="Reason For Report"
                                    value={reasonForReport}
                                    variant="outlined"
                                    onChange={(e) => setReasonForReport(e.target.value)}
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
                modalType === "DELETEPARENTPOST" &&
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

        </>
    )
}

export default ForumPostModal


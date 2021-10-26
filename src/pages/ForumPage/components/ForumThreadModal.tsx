import { useEffect, useState } from 'react';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    ListItemIcon
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from "../../../values/ButtonElements";
import { CreateNewForumThreadReq } from '../../../Entities/ForumThread';
import { Course } from '../../../Entities/Course';
import { ForumCategory } from '../../../Entities/ForumCategory';
import { createNewForumThread, deleteForumThread } from "../../../apis/ForumApis";
import { setCourseRatingByEnrolledCourseId } from '../../../apis/EnrolledCourseApis';
import { getCourseByCourseId } from '../../../apis/CourseApis';

function ForumThreadModal(props: any) {

    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [modalType, setModalType] = useState<string>("");
    const [course, setCourse] = useState<Course>();
    const [forumCategoryToSubmit, setForumCategoryToSubmit] = useState<ForumCategory>();
    const loggedInAccountId = window.sessionStorage.getItem("loggedInAccountId");
    const [formIsValidObj, setFormIsValidObj] = useState<any>({ name: false, description: false });


    useEffect(() => {
        setForumCategoryToSubmit(props.forumCategory);
        setModalType(props.modalType);
        if (props.courseId) {
            getCourseByCourseId(props.courseId).then((res) => {
                setCourse(res);
            }).catch((err) => {
                console.log("error getting course", err);
            })
        }
        if (props.modalType === "EDIT" || props.modalType === "DELETE") {
            const forumThreadName = props.forumCategory.forumThreads.filter((forumThread: any) => forumThread.forumThreadId === props.menuInfo.forumThreadId).pop()?.name
            setName(forumThreadName);
            setDescription(props.forumCategory.description);
        }
    }, [props.forumCategory, props.modalType, props.courseId, open])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setName("");
        setDescription("");
        setOpen(false);
    };

    const handleCreateConfirm = () => {
        if (name.length === 0 || description.length === 0) {
            const isNameEmpty = name.length === 0;
            const isDescEmpty = description.length === 0;
            setFormIsValidObj({ name: isNameEmpty, description: isDescEmpty });
        } else if (loggedInAccountId != null
            && forumCategoryToSubmit
            && forumCategoryToSubmit.forumCategoryId !== null) {
            const createNewForumThreadReq: CreateNewForumThreadReq = {
                name,
                description,
                timeStamp: new Date(),
                accountId: parseInt(loggedInAccountId),
                forumCategoryId: forumCategoryToSubmit.forumCategoryId
            }
            createNewForumThread(createNewForumThreadReq).then((res) => {
                props.onForumThreadChange({ message: "Forum Thread Creation Succeeded", type: "success" });
            }).catch((err) => {
                props.onForumThreadChange({ message: `Forum Thread Creation Failed: ${err.response.data.message}`, type: "error" });

            })
            handleClose();
        }
    }

    const handleEditConfirm = () => {
        setOpen(false);
    }

    const handleDeleteConfirm = () => {
        if (course !== undefined && loggedInAccountId !== null) {
            if (props.menuInfo.accountId === parseInt(loggedInAccountId) || course?.tutor.accountId === parseInt(loggedInAccountId)) {
                deleteForumThread(props.menuInfo.forumThreadId)
                    .then((res) => {
                        props.onForumThreadChange({ message: "Forum Thread Deletion Succeeded", type: "success" });
                        props.handleMenuClose();
                    }).catch((err) => {
                        props.onForumThreadChange({ message: err.response.data.message, type: "error" })
                    })
            } else {
                props.onForumThreadChange({ message: "You are not the author of this thread", type: "error" })
            }
        }
    }

    return (
        <>
            {
                modalType === "CREATE" &&
                <>
                    <IconButton aria-label="settings" color="primary" onClick={handleOpen}>
                        <AddIcon /> &nbsp; Add Thread
                    </IconButton>
                    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
                        <DialogTitle>Create Forum Thread</DialogTitle>
                        <DialogContent>
                            <TextField
                                required
                                fullWidth
                                id="outlined-required"
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={formIsValidObj.name}
                            />
                            <TextField
                                required
                                fullWidth
                                id="outlined-required"
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                error={formIsValidObj.description}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button primary onClick={handleCreateConfirm}>Confirm</Button>
                        </DialogActions>
                    </Dialog>
                </>
            }

            {
                modalType === "EMPTY" &&
                <>
                    <Button onClick={handleOpen} primary>
                        Start A Thread
                    </Button>
                    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
                        <DialogTitle>Create Forum Thread</DialogTitle>
                        <DialogContent>
                            <TextField
                                required
                                fullWidth
                                id="outlined-required"
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={formIsValidObj.name}
                            />
                            <TextField
                                required
                                fullWidth
                                id="outlined-required"
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                error={formIsValidObj.description}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button primary onClick={handleCreateConfirm}>Confirm</Button>
                        </DialogActions>
                    </Dialog>
                </>
            }

            {
                modalType === "DELETE" &&
                <>
                    <ListItemIcon onClick={handleOpen}>
                        <DeleteIcon /> Delete
                    </ListItemIcon>
                    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
                        <DialogTitle>Delete Forum Thread</DialogTitle>
                        <DialogContent>
                            Are you sure you want to delete: {name} ?
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

export default ForumThreadModal


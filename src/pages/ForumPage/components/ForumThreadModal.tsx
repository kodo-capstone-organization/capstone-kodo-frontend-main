import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from "../../../values/ButtonElements";
import { ForumThread, CreateNewForumThreadReq } from '../../../apis/Entities/ForumThread';
import { createNewForumThread } from "../../../apis/Forum/ForumApis";

function ForumThreadModal(props: any) {

    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [modalType, setModalType] = useState<string>("");
    const [forumCategoryToSubmit, setForumCategoryToSubmit] = useState<ForumCategory>();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    useEffect(() => {
        setModalType(props.modalType);
        if (props.modalType === "EDIT" || props.modalType === "DELETE") {
            setForumCategoryToSubmit(props.forumCategory);
            setName(props.forumCategory.name);
            setDescription(props.forumCategory.description);
        }
    }, [props, open])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setName("");
        setOpen(false);
    };

    const handleCreateConfirm = () => {
        const createNewForumCategoryReq: CreateNewForumCategoryReq = {
            name,
            description,
            courseId: props.courseId
        }
        createNewForumCategory(createNewForumCategoryReq).then((res) => {
            props.onForumCategoryChange({ message: "Forum Category Creation Succeeded", type: "success" });
            console.log("Success", res);
        }).catch((err) => {
            props.onForumCategoryChange({ message: `Forum Category Creation Failed: ${err.response.data.message}`, type: "error" });
        })
        setOpen(false);
    }

    const handleEditConfirm = () => {
        const forumCategory: ForumCategory = Object.assign(forumCategoryToSubmit, { name, description });
        const updateForumCategoryReq: UpdateForumCategoryReq = {
            forumCategory
        }
        console.log("updateForumCategoryReq", updateForumCategoryReq);
        updateForumCategory(updateForumCategoryReq).then((res) => {
            props.onForumCategoryChange({ message: "Forum Category Update Succeeded", type: "success" });
            console.log("Success", res);
        }).catch((err) => {
            props.onForumCategoryChange({ message: "Forum Category Update Failed", type: "error" });
        })
        setOpen(false);
    }

    const handleDeleteConfirm = () => {
        deleteForumCategory(forumCategoryToSubmit.forumCategoryId).then((res) => {
            props.onForumCategoryChange({ message: "Forum Category Delete Success", type: "success" });
        }).catch((err) => {
            props.onForumCategoryChange({ message: "Forum Category Delete Failed", type: "error" });
        });
        setOpen(false);
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
                            />
                            <TextField
                                required
                                fullWidth
                                id="outlined-required"
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                    <Button onClick={handleOpen}>
                        Create A Thread
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
                            />
                            <TextField
                                required
                                fullWidth
                                id="outlined-required"
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                modalType === "EDIT" &&
                <>
                    <IconButton disabled={isDisabled} onClick={handleOpen}>
                        <EditIcon />
                    </IconButton>
                    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
                        <DialogTitle>Edit Forum Category</DialogTitle>
                        <DialogContent>
                            <TextField
                                required
                                fullWidth
                                id="outlined-required"
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                required
                                fullWidth
                                id="outlined-required"
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button primary onClick={handleEditConfirm}>Confirm</Button>
                        </DialogActions>
                    </Dialog>
                </>
            }

            {
                modalType === "DELETE" &&
                <>
                    <IconButton disabled={isDisabled} onClick={handleOpen}>
                        <DeleteIcon />
                    </IconButton>
                    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
                        <DialogTitle>Delete Forum Category</DialogTitle>
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


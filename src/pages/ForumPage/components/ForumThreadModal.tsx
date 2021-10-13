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
import { ForumThread, CreateNewForumThreadReq } from '../../../apis/Entities/ForumThread';
import { ForumCategory } from '../../../apis/Entities/ForumCategory';
import { createNewForumThread } from "../../../apis/Forum/ForumApis";

function ForumThreadModal(props: any) {

    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [modalType, setModalType] = useState<string>("");
    const [forumCategoryToSubmit, setForumCategoryToSubmit] = useState<ForumCategory>();
    const loggedInAccountId = window.sessionStorage.getItem("loggedInAccountId");


    useEffect(() => {
        setForumCategoryToSubmit(props.forumCategory);
        setModalType(props.modalType);
        if (props.modalType === "EDIT" || props.modalType === "DELETE") {
            setName(props.forumCategory.name);
            setDescription(props.forumCategory.description);
        }
    }, [props, open])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setName("");
        setDescription("");
        setOpen(false);
    };

    const handleCreateConfirm = () => {
        if (loggedInAccountId != null 
            && forumCategoryToSubmit
            && forumCategoryToSubmit.forumCategoryId !== null) {
            const createNewForumThreadReq: CreateNewForumThreadReq = {
                name,
                description,
                timeStamp: new Date(),
                accountId: parseInt(loggedInAccountId),
                forumCategoryId: forumCategoryToSubmit.forumCategoryId
            }
            console.log(createNewForumThreadReq);
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
                    <ListItemIcon onClick={handleOpen}>
                        <EditIcon />
                    </ListItemIcon>
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
                    <ListItemIcon onClick={handleOpen}>
                        <DeleteIcon />
                    </ListItemIcon>
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


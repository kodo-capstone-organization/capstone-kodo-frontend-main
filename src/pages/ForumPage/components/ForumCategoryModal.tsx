import { useEffect, useState } from 'react';
import { createTheme } from "@material-ui/core";


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
import { ForumCategory, CreateNewForumCategoryReq, UpdateForumCategoryReq } from '../../../entities/ForumCategory';
import { createNewForumCategory, updateForumCategory, deleteForumCategory } from "../../../apis/ForumApis";

const themeInstance = createTheme({
    overrides: {
        MuiIconButton: {
            root: {
                fontSize: "unset ! important"
            }
        }
    }
});

function ForumCategoryModal(props: any) {

    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [formIsValidObj, setFormIsValidObj] = useState<any>({ name: false, description: false });
    const [courseId, setCourseId] = useState<number>();
    const [modalType, setModalType] = useState<string>("");
    const [forumCategoryToSubmit, setForumCategoryToSubmit] = useState<ForumCategory>();

    useEffect(() => {
        setCourseId(props.courseId);
        setModalType(props.modalType);
        setForumCategoryToSubmit(props.forumCategory);
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
        setOpen(false);
    };

    const handleCreateConfirm = () => {
        if (name.length === 0 || description.length === 0) {
            const isNameEmpty = name.length === 0;
            const isDescEmpty = description.length === 0;
            setFormIsValidObj({ name: isNameEmpty, description: isDescEmpty });
        }
        else if (courseId) {
            const createNewForumCategoryReq: CreateNewForumCategoryReq = {
                name,
                description,
                courseId
            }
            createNewForumCategory(createNewForumCategoryReq).then((res) => {
                setName("");
                setDescription("");
                props.onForumCategoryChange({ message: "Forum Category Creation Succeeded", type: "success" });
            }).catch((err) => {
                props.onForumCategoryChange({ message: `Forum Category Creation Failed: ${err.response.data.message}`, type: "error" });
            })
            setOpen(false);
        }
    }

    const handleEditConfirm = () => {
        if (name.length === 0 || description.length === 0) {
            const isNameEmpty = name.length === 0;
            const isDescEmpty = description.length === 0;
            setFormIsValidObj({ name: isNameEmpty, description: isDescEmpty });
        } else {
            const forumCategory: ForumCategory = Object.assign(forumCategoryToSubmit, { name, description });
            const updateForumCategoryReq: UpdateForumCategoryReq = {
                forumCategory
            }
            updateForumCategory(updateForumCategoryReq).then((res) => {
                setName("");
                setDescription("");
                props.onForumCategoryChange({ message: "Forum Category Update Succeeded", type: "success" });
            }).catch((err) => {
                props.onForumCategoryChange({ message: "Forum Category Update Failed", type: "error" });
            })
            setOpen(false);
        }
    }

    const handleDeleteConfirm = () => {
        if (forumCategoryToSubmit && forumCategoryToSubmit.forumCategoryId !== null) {
            deleteForumCategory(forumCategoryToSubmit.forumCategoryId).then((res) => {
                props.onForumCategoryChange({ message: "Forum Category Delete Success", type: "success" });
            }).catch((err) => {
                props.onForumCategoryChange({ message: "Forum Category Delete Failed", type: "error" });
            });
            props.handleMenuClose();
            setOpen(false);
        }
    }

    return (
        <>
            {
                modalType === "CREATE" &&
                <>
                    <IconButton aria-label="settings" color="primary" onClick={handleOpen}>
                        <AddIcon /> &nbsp; Add Category
                    </IconButton>
                    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
                        <DialogTitle>Create Forum Category</DialogTitle>
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
                    <Button primary onClick={handleOpen}>
                        <AddIcon /> &nbsp; Start A Category
                    </Button>
                    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
                        <DialogTitle>Create Forum Category</DialogTitle>
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
                    <ListItemIcon onClick={handleOpen} >
                        <EditIcon /> Edit Category
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
                            <Button primary onClick={handleEditConfirm}>Confirm</Button>
                        </DialogActions>
                    </Dialog>
                </>
            }

            {
                modalType === "DELETE" &&
                <>
                    <ListItemIcon onClick={handleOpen} >
                        <DeleteIcon /> Delete Category
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

            {/* {
                modalType === "REPORT" &&
                <>
                    <ListItemIcon onClick={handleOpen} >
                        <DeleteIcon /> Report Category
                    </ListItemIcon>
                    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
                        <DialogTitle>Report Forum Category</DialogTitle>
                        <DialogContent>
                            Are you sure you want to report: {name} ?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button primary onClick={handleReportConfirm}>Confirm</Button>
                        </DialogActions>
                    </Dialog>
                </>
            } */}

        </>
    )
}

export default ForumCategoryModal


import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
    CourseDetails,
    CourseElement
} from "../ProgressElements";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import { Button } from "../../../values/ButtonElements";
import { Account } from "../../../apis/Entities/Account";
import { Content } from "../../../apis/Entities/Content";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
        demo: {
            backgroundColor: theme.palette.background.paper,
        },
        title: {
            margin: theme.spacing(4, 0, 2),
        },
    }),
);


function MultimediaModal(props: any) {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [myAccount, setMyAccount] = useState<Account>()
    const [contents, setContents] = useState<Content[]>()
    const [lesson, setLesson] = useState<any>()
    const [isActive, setIsActive] = useState<Boolean>()

    useEffect(() => {
        setMyAccount(props.account)
        setLesson(props.lesson)
        if (props.lesson !== undefined) {
            setContents(props.lesson.contents)
        }
    }, [props.lesson])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAction = () => {
    };

    // const function generate(element: React.ReactElement) {
    //     return [0, 1, 2].map((value) =>
    //       React.cloneElement(element, {
    //         key: value,
    //       }),
    //     );
    //   }

    const listOfContentUrl = () => {
        contents?.map((content, contentId) => {
            return (
                <CourseElement key={contentId}>
                    <CourseDetails>
                        <h3>{content.name}</h3>
                    </CourseDetails>
                </CourseElement>
            )
        })
    }

    return (
        <>
            <div>
                <IconButton onClick={handleOpen}>
                    <InfoIcon />
                </IconButton>
                <Dialog open={open} onClose={handleClose}>
                    <div style={{ display: "flex" }}>
                        <DialogTitle id="form-dialog-title">View Lesson Multimedia</DialogTitle>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <DialogContent>
                        <DialogContentText>
                            <Grid container>
                                <Grid item xs={5} style={{ margin: "5px" }}>
                                    {/* {JSON.stringify(contents)} */}
                                    {contents?.map((content, contentId) => {
                                        <CourseElement key={contentId}>
                                            <CourseDetails>
                                                <h3>{JSON.stringify(content)}</h3>
                                            </CourseDetails>
                                        </CourseElement>
                                    })}
                                </Grid>
                            </Grid>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
}

export default MultimediaModal;
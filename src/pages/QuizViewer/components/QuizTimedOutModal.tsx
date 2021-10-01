import React, { useState, useEffect } from "react";

import { Button } from "../../../values/ButtonElements";
import { colours } from "../../../values/Colours";
import {
    Dialog, DialogActions, DialogContent, Table,
    DialogTitle, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from "@material-ui/core";
import { makeStyles, Theme, createStyles, withStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';

import { useHistory } from "react-router-dom";
import { StudentAttempt } from "../../../apis/Entities/StudentAttempt";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dialogPaper: {
            height: "200px",
            width: 500,
        },
    }),
);


function QuizTimedOutModal(props: any) {

    let history = useHistory();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);


    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);


    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    const navigateToMarkedQuizView = (studentAttemptId: number) => {
        console.log("studentAttemptId", studentAttemptId);
        history.push({ pathname: `/markedquizviewer/${studentAttemptId}`, state: { mode: 'VIEW' } });

    }


    return (
        <>
            <Button style={{ display: "none" }} >
                View Previous Attempts
            </Button>
            <Dialog open={open} maxWidth={false} classes={{ paper: classes.dialogPaper }}>
                <DialogTitle id="form-dialog-title">Time's Up!</DialogTitle>
                <DialogContent>
                    You have exceeded the set time for this quiz, your attempt will be recorded up to where you stopped.
                </DialogContent>
                <DialogActions>
                    <Button >
                        Next
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default QuizTimedOutModal;


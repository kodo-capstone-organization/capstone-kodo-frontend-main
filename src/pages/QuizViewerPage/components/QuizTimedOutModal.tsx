import React, { useEffect } from "react";

import { 
    Theme, 
    makeStyles, 
    createStyles 
} from '@material-ui/core/styles';
import {
    Dialog, 
    DialogActions, 
    DialogContent,
    DialogTitle    
} from "@material-ui/core";

import { Button } from "../../../values/ButtonElements";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dialogPaper: {
            height: "200px",
            width: 500,
        },
    }),
);


function QuizTimedOutModal(props: any) {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    return (
        <>
            <Dialog open={open} maxWidth={false} classes={{ paper: classes.dialogPaper }}>
                <DialogTitle id="form-dialog-title">Time's Up!</DialogTitle>
                <DialogContent>
                    You have exceeded the set time for this quiz, your attempt will be submitted based on your current point.
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleSubmit}>
                        Next
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default QuizTimedOutModal;


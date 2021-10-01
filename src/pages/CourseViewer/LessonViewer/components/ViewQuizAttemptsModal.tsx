import React, { useState, useEffect } from "react";

import { Button } from "../../../../values/ButtonElements";
import { colours } from "../../../../values/Colours";
import {
  Dialog, DialogActions, DialogContent, Table,
  DialogTitle, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from "@material-ui/core";
import { makeStyles, Theme, createStyles, withStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';

import { useHistory } from "react-router-dom";
import { StudentAttempt } from "../../../../apis/Entities/StudentAttempt";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 700,
    },
    container: {
      maxHeight: 440,
    },
    dialogPaper: {
      height: "400px",
      width: 1000,
    },
  }),
);


function ViewQuizAttemptsModal(props: any) {

  let history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [studentAttempts, setStudentAttempts] = useState<StudentAttempt[]>([]);


  useEffect(() => {
    setStudentAttempts(props.studentAttempts);
    console.log("props.studentAttempts", props.studentAttempts);
  }, [props.studentAttempts]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formatDate = (date: Date) => {
    var d = new Date(date);
    return d.toDateString() + ', ' + d.toLocaleTimeString();
  }

  const navigateToMarkedQuizView = (studentAttemptId : number) => {
    console.log("studentAttemptId", studentAttemptId);
    history.push({ pathname: `/markedquizviewer/${studentAttemptId}`, state: { mode: 'VIEW' } });

  }


  return (
    <>
      <Button disabled={props.isButtonDisabled} onClick={handleOpen}>
        View Previous Attempts
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth={false} classes={{ paper: classes.dialogPaper }}>
        <DialogTitle id="form-dialog-title">View Previous Attempts</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} className={classes.container}>
            <Table size="small" stickyHeader className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell >Date Of Attempt</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {studentAttempts != undefined && studentAttempts.map((row: any) => (
                  <TableRow key={row.studentAttemptId}>
                    <TableCell component="th" scope="row">
                      {row.quiz.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {formatDate(row.dateTimeOfAttempt)}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() =>navigateToMarkedQuizView(row.studentAttemptId)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ViewQuizAttemptsModal;


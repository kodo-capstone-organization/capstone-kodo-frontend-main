import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";

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

import { Course } from "../../../apis/Entities/Course";
import { Lesson } from "../../../apis/Entities/Lesson";

import { getCourseByEnrolledContentId } from "../../../apis/Course/CourseApis";
import { getLessonByEnrolledContentId } from "../../../apis/Lesson/LessonApis";
import { createNewStudentAttempt } from "../../../apis/StudentAttempt/StudentAttemptApis";

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

    let history = useHistory();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);


    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    const handleNextAction = () => {
        createNewStudentAttempt(props.createNewStudentAttemptReq)
            .then(res => {
            props.callOpenSnackBar("Quiz Submitted Successfully", "success");
            getCourseByEnrolledContentId(props.enrolledContentId).then((course: Course) => {
                getLessonByEnrolledContentId(props.enrolledContentId).then((lesson: Lesson) => {
                    history.push(`/overview/course/${course.courseId}/lesson/${lesson.lessonId}`);
                    // console.log("Attempt quiz success:", res);
                })
                .catch(err => {
                    console.log(err.response.data.message)
                })
            })            
        })
    }

    return (
        <>
            <Dialog open={open} maxWidth={false} classes={{ paper: classes.dialogPaper }}>
                <DialogTitle id="form-dialog-title">Time's Up!</DialogTitle>
                <DialogContent>
                    You have exceeded the set time for this quiz, your attempt will be submitted based on your current point.
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNextAction}>
                        Next
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default QuizTimedOutModal;


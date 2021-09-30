import React, { useEffect, useState } from "react";
import { StudentAttempt } from "../../../apis/Entities/StudentAttempt";
import { StudentAttemptQuestion } from "../../../apis/Entities/StudentAttemptQuestion";
import { QuizQuestion } from "../../../apis/Entities/QuizQuestion";
import { Quiz } from "../../../apis/Entities/Quiz";
import { StudentAttemptAnswer } from "../../../apis/Entities/StudentAttemptAnswer";

import { getQuizByQuizId } from "../../../apis/Quiz/QuizApis";

import {
    QuizContainer, QuizCard, QuizCardHeader, QuizCardContent, QuizQuestionCard,
    QuizViewerCardContent, MarkedQuizViewerTableRow
} from "../QuizViewerElements";
import {
    Grid, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Checkbox, Paper, TextField, Radio,
    makeStyles, createStyles, Theme, createMuiTheme, ThemeProvider
} from "@material-ui/core";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';



const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            // backgroundColor: "green"
        }
    }),
);

const themeInstance = createMuiTheme({
    overrides: {
        MuiTableRow: {
            root: {
                '&.Mui-selected': {
                    backgroundColor: "#C8E6C9 ! important"
                }
            }
        }
    }
});

function AttemptQuizComponent(props: any) {

    const classes = useStyles();


    useEffect(() => {
        getQuizByQuizId(props.quizId)
        .then(res => {console.log("Success in getQuizByQuizId", res);})
        .catch(err => {console.log("Error in getQuizByQuizId", err);})

    }, [props.quizId]);

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    const mapQuestionArray = (attemptArray: StudentAttemptQuestion[]) => {
    };

    return (
        <>
            {/* {mapQuestionArray()} */}
        </>
    );
}

export default AttemptQuizComponent;

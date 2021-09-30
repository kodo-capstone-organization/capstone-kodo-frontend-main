import React, { useEffect, useState } from "react";
import { StudentAttempt } from "../../../apis/Entities/StudentAttempt";
import { StudentAttemptQuestion } from "../../../apis/Entities/StudentAttemptQuestion";
import { QuizQuestion } from "../../../apis/Entities/QuizQuestion";
import { Quiz } from "../../../apis/Entities/Quiz";
import { StudentAttemptAnswer } from "../../../apis/Entities/StudentAttemptAnswer";

import { getStudentAttemptByStudentAttemptId } from "../../../apis/StudentAttempt/StudentAttemptApis";

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

function MarkedQuizComponent(props: any) {
    // const studentAttemptId = props.match.params.studentAttemptId;
    const [studentAttemptQuestion, setStudentAttemptQuestion] = useState<StudentAttemptQuestion>();
    const [quizQuestion, setQuizQuestion] = useState<QuizQuestion>();
    const [questionType, setQuestionType] = useState<string>("");
    const [quizQuestionOptions, setQuizQuestionOptions] = useState<QuizQuestionOption[]>([]);
    const [studentAttemptAnswers, setStudentAttemptAnswers] = useState<StudentAttemptAnswer[]>();
    const [index, setIndex] = useState<number>();
    const classes = useStyles();


    useEffect(() => {
        console.log(props.studentAttemptQuestion.studentAttemptAnswers);
        setIndex(props.index)
        setStudentAttemptQuestion(props.studentAttemptQuestion);
        setQuizQuestion(props.studentAttemptQuestion.quizQuestion);
        setStudentAttemptAnswers(props.studentAttemptQuestion.studentAttemptAnswers);
        setQuestionType(props.studentAttemptQuestion.quizQuestion.questionType);
        setQuizQuestionOptions(props.studentAttemptQuestion.quizQuestion.quizQuestionOptions);
    }, [props.studentAttemptQuestion]);

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    return (
        <>
            {index + 1}. {quizQuestion != undefined && quizQuestion.content}
            <ThemeProvider theme={themeInstance}>
                <TableContainer component={Paper} style={{ margin: "16px 0px 16px 0px" }}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                {
                                    (questionType === "MCQ" || questionType === "TF") &&
                                    <>
                                        <TableCell>Options</TableCell>
                                        <TableCell align="right">Answer</TableCell>
                                    </>

                                }
                                {
                                    questionType === "MATCHING" &&
                                    <>
                                        <TableCell>LEFT</TableCell>
                                        <TableCell>RIGHT</TableCell>
                                        <TableCell align="right">Answer</TableCell>
                                    </>

                                }
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {
                                questionType === "MCQ" &&
                                quizQuestionOptions?.map((row, index) => (
                                    <MarkedQuizViewerTableRow
                                        key={index}
                                        selected={row.correct}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.leftContent}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Radio
                                                checked={row.correct}
                                                value={index}
                                            />
                                        </TableCell>
                                    </MarkedQuizViewerTableRow>
                                ))


                            }

                            {
                                questionType === "TF" &&
                                quizQuestionOptions?.map((row, index) => (
                                    <MarkedQuizViewerTableRow
                                        key={index}
                                        selected={row.correct}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.leftContent}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Radio
                                                checked={row.correct}
                                                value={index}
                                            />
                                        </TableCell>
                                    </MarkedQuizViewerTableRow>
                                ))
                            }
                            {
                                questionType === "MATCHING" &&
                                quizQuestionOptions?.map((row, index) => (
                                    <MarkedQuizViewerTableRow
                                        key={index}
                                        selected={row.correct}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.leftContent}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.rightContent}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Checkbox
                                                checked={row.correct}
                                                value={index}
                                            />
                                        </TableCell>
                                    </MarkedQuizViewerTableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </ThemeProvider>
            Your Answer(s):
            <TableContainer component={Paper} style={{ margin: "16px 0px 16px 0px" }}>
                <Table size="small">
                    <TableBody>
                        {
                            (questionType === "TF" || questionType === "MCQ") &&
                            studentAttemptAnswers?.map((row, index) => (
                                <MarkedQuizViewerTableRow>
                                    <TableCell component="th" scope="row">
                                        {row.leftContent}
                                    </TableCell>
                                    <TableCell align="right">
                                    {row.correct ? <CheckCircleIcon style={{ color: "green", padding:"10px" }} /> : <CancelIcon color={"error"} style={{padding:"10px"}}/>}
                                    </TableCell>
                                </MarkedQuizViewerTableRow>

                            ))
                        }
                        {
                            questionType === "MATCHING" &&
                            studentAttemptAnswers?.map((row, index) => (
                                <MarkedQuizViewerTableRow>
                                    <TableCell component="th" scope="row">
                                        {row.leftContent}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.rightContent}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.correct ? <CheckCircleIcon style={{ color: "green", padding:"10px" }} /> : <CancelIcon color={"error"} style={{padding:"10px"}}/>}
                                    </TableCell>
                                </MarkedQuizViewerTableRow>

                            ))
                        }

                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default MarkedQuizComponent;

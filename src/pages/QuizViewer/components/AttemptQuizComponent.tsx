import React, { useEffect, useState } from "react";
import { StudentAttempt } from "../../../apis/Entities/StudentAttempt";
import { StudentAttemptQuestion } from "../../../apis/Entities/StudentAttemptQuestion";
import { QuizQuestion } from "../../../apis/Entities/QuizQuestion";
import { Quiz } from "../../../apis/Entities/Quiz";
import { StudentAttemptAnswer } from "../../../apis/Entities/StudentAttemptAnswer";
import { CreateNewStudentAttemptReq } from "../../../apis/Entities/StudentAttempt";


import { getQuizByQuizId } from "../../../apis/Quiz/QuizApis";
import { getAllQuizQuestionsByQuizId, getQuizQuestionByQuizQuestionId } from "../../../apis/QuizQuestion/QuizQuestionApis";
import { createNewStudentAttempt } from "../../../apis/Quiz/StudentAttemptApis";


import {
    QuizContainer, QuizCard, QuizCardHeader, QuizCardContent, QuizQuestionCard,
    QuizViewerCardContent, MarkedQuizViewerTableRow
} from "../QuizViewerElements";
import {
    Grid, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Checkbox, Paper, TextField, Radio, Divider,
    makeStyles, createStyles, Theme, createMuiTheme, ThemeProvider
} from "@material-ui/core";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

function AttemptQuizComponent(props: any) {

    const [quiz, setQuiz] = useState<Quiz>();
    const [quizQuestionArray, setQuizQuestionArray] = useState<QuizQuestion[]>();
    const [quizQuestionOptionIdList, setQuizQuestionOptionIdList] = useState<number[][]>([]);



    useEffect(() => {
        if (props.enrolledContentId != undefined) {
            // getQuizByQuizId(props.quizId)
            //     .then(res => {
            //         setQuiz(res);
            //         console.log("Success in getQuizByQuizId", res);
            //     })
            //     .catch(err => { console.log("Error in getQuizByQuizId", err); })
            // getAllQuizQuestionsByQuizId(props.quizId).then((res) => {
            //     setQuizQuestionArray(res)
            //     console.log("Success in getAllQuizQuestionsByQuizId", res);
            // }).catch((err) => { console.log("error:getAllQuizQuestionsByQuizId", err) });
        }
    }, [props.quizId]);

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    const handleAttemptAnswer = (questionIndex: number, chosenOptions: number[]) => {
        // quizQuestionOptionIdList[questionIndex] = chosenOptions;
    }

    const mapQuestionArray = (questionArray: QuizQuestion[]) => {
        return (
            <div>
                {questionArray.map((question, qId) => {
                    return (
                        <>
                            <QuizQuestionCard key={qId}>
                                {qId + 1}. {question.content}
                                <TableContainer component={Paper} style={{ margin: "16px 0px 16px 0px" }}>
                                    <Table size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                {
                                                    (question.questionType === "MCQ" || question.questionType === "TF") &&
                                                    <>
                                                        <TableCell>Options</TableCell>
                                                        <TableCell align="right">Answer</TableCell>
                                                    </>

                                                }
                                                {
                                                    question.questionType === "MATCHING" &&
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
                                                question.questionType === "MCQ" &&
                                                question.quizQuestionOptions?.map((row, index) => (
                                                    <MarkedQuizViewerTableRow
                                                        key={index}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.leftContent}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Radio
                                                                value={index}
                                                            />
                                                        </TableCell>
                                                    </MarkedQuizViewerTableRow>
                                                ))


                                            }

                                            {
                                                question.questionType === "TF" &&
                                                question.quizQuestionOptions?.map((row, index) => (
                                                    <MarkedQuizViewerTableRow
                                                        key={index}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.leftContent}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Radio
                                                                value={index}
                                                            />
                                                        </TableCell>
                                                    </MarkedQuizViewerTableRow>
                                                ))
                                            }
                                            {
                                                question.questionType === "MATCHING" &&
                                                question.quizQuestionOptions?.map((row, index) => (
                                                    <MarkedQuizViewerTableRow
                                                        key={index}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.leftContent}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {row.rightContent}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Checkbox
                                                                value={index}
                                                            />
                                                        </TableCell>
                                                    </MarkedQuizViewerTableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </QuizQuestionCard>
                        </>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <QuizCard>
                <QuizCardHeader
                    title="Quiz Information"
                />
                <QuizCardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            Name: {quiz != undefined && quiz.name}
                        </Grid>
                        <Divider style={{ width: '-webkit-fill-available' }} variant="middle" />
                        <Grid item xs={12}>
                            Description: {quiz != undefined && quiz.description}
                        </Grid>
                    </Grid>
                </QuizCardContent>
            </QuizCard>
            <QuizCard>
                <QuizCardHeader
                    title={quiz != undefined ? quiz.name : ""}
                />
                <QuizViewerCardContent>
                    {quizQuestionArray != undefined && mapQuestionArray(quizQuestionArray)}
                </QuizViewerCardContent>
            </QuizCard>
        </>
    );
}

export default AttemptQuizComponent;

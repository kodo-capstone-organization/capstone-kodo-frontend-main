import { useEffect, useState } from "react";

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import {
    Checkbox, 
    Divider, 
    Grid, 
    Paper, 
    Radio,
    Table,
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead,
    TableRow, 
    ThemeProvider,
    createMuiTheme, 
} from "@material-ui/core";

import { Quiz } from "../../../apis/Entities/Quiz";
import { StudentAttempt } from "../../../apis/Entities/StudentAttempt";
import { StudentAttemptQuestion } from "../../../apis/Entities/StudentAttemptQuestion";

import { getStudentAttemptByStudentAttemptId } from "../../../apis/StudentAttempt/StudentAttemptApis";

import {
    MarkedQuizViewerTableRow,
    QuizCard, 
    QuizCardContent, 
    QuizCardHeader, 
    QuizQuestionCard,
    QuizViewerCardContent, 
} from "../QuizViewerElements";

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
    const [studentAttempt, setStudentAttempt] = useState<StudentAttempt>();
    const [studentAttemptQuestions, setStudentAttemptQuestions] = useState<StudentAttemptQuestion[]>([]);
    const [quiz, setQuiz] = useState<Quiz>();

    useEffect(() => {
        getStudentAttemptByStudentAttemptId(props.studentAttemptId).then(studentAttempt => {
            setStudentAttempt(studentAttempt);
            setQuiz(studentAttempt.quiz);
            setStudentAttemptQuestions(studentAttempt.studentAttemptQuestions);
        }).catch((err) => { console.log("error:getStudentAttemptByStudentAttemptId", err) });
    }, [props.studentAttemptId]);

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    const getScore = () => {
        var score = 0;
        var totalMarks = 0;
        studentAttemptQuestions.map((q) => {
            totalMarks = totalMarks + q.quizQuestion.marks;
            const studentAttemptAnswerList = q.studentAttemptAnswers;
            var correct = true;
            studentAttemptAnswerList.map((studentAnswer) => {
                console.log(studentAnswer);
                return(studentAnswer.correct ? score = score + studentAnswer.marks: correct=false);
            })
        })
        return `${score}/${totalMarks}`;
    }

    const mapQuestionArray = (attemptArray: StudentAttemptQuestion[]) => {
        return (
            <div>
                {attemptArray.map( (studentAttempt, qId) => {
                    return (
                        <>
                            <QuizQuestionCard key={qId}>
                                {qId + 1}. {studentAttempt.quizQuestion.content}
                                <ThemeProvider theme={themeInstance}>
                                    <TableContainer component={Paper} style={{ margin: "16px 0px 16px 0px" }}>
                                        <Table size="small" aria-label="a dense table">
                                            <TableHead>
                                                <TableRow>
                                                    {
                                                        (studentAttempt.quizQuestion.questionType === "MCQ" || studentAttempt.quizQuestion.questionType === "TF") &&
                                                        <>
                                                            <TableCell>Options</TableCell>
                                                            <TableCell align="right">Answer</TableCell>
                                                        </>

                                                    }
                                                    {
                                                        studentAttempt.quizQuestion.questionType === "MATCHING" &&
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
                                                    studentAttempt.quizQuestion.questionType === "MCQ" &&
                                                    studentAttempt.quizQuestion.quizQuestionOptions?.map((row, index) => (
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
                                                    studentAttempt.quizQuestion.questionType === "TF" &&
                                                    studentAttempt.quizQuestion.quizQuestionOptions?.map((row, index) => (
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
                                                    studentAttempt.quizQuestion.questionType === "MATCHING" &&
                                                    studentAttempt.quizQuestion.quizQuestionOptions?.map((row, index) => (
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
                                                (studentAttempt.quizQuestion.questionType === "TF" || studentAttempt.quizQuestion.questionType === "MCQ") &&
                                                studentAttempt.studentAttemptAnswers?.map((row, index) => (
                                                    <MarkedQuizViewerTableRow>
                                                        <TableCell component="th" scope="row">
                                                            {row.leftContent}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {row.correct ? <CheckCircleIcon style={{ color: "green", padding: "10px" }} /> : <CancelIcon color={"error"} style={{ padding: "10px" }} />}
                                                        </TableCell>
                                                    </MarkedQuizViewerTableRow>

                                                ))
                                            }
                                            {
                                                studentAttempt.quizQuestion.questionType === "MATCHING" &&
                                                studentAttempt.studentAttemptAnswers?.map((row, index) => (
                                                    <MarkedQuizViewerTableRow>
                                                        <TableCell component="th" scope="row">
                                                            {row.leftContent}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {row.rightContent}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {row.correct ? <CheckCircleIcon style={{ color: "green", padding: "10px" }} /> : <CancelIcon color={"error"} style={{ padding: "10px" }} />}
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
                            Name: {quiz !== undefined && quiz.name}
                        </Grid>
                        <Divider style={{ width: '-webkit-fill-available' }} variant="middle" />
                        <Grid item xs={12}>
                            Description: {quiz !== undefined && quiz.description}
                        </Grid>
                        <Divider style={{ width: '-webkit-fill-available' }} variant="middle" />
                        <Grid item xs={12}>
                            Completed On: {studentAttempt !== undefined && formatDate(studentAttempt.dateTimeOfAttempt)}
                        </Grid>
                        <Divider style={{ width: '-webkit-fill-available' }} variant="middle" />
                        <Grid item xs={12}>
                            Score: {getScore()}
                        </Grid>
                    </Grid>
                </QuizCardContent>
            </QuizCard>
            <QuizCard>
                <QuizCardHeader
                    title={quiz !== undefined ? quiz.name : ""}
                />
                <QuizViewerCardContent>
                    {mapQuestionArray(studentAttemptQuestions)}
                </QuizViewerCardContent>
            </QuizCard>
        </>
    );
}

export default MarkedQuizComponent;

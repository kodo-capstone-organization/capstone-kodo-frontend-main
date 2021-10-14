import { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { Link } from '@material-ui/core';
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
import { StudentAttemptAnswer } from "../../../apis/Entities/StudentAttemptAnswer";

import { getEnrolledCourseByEnrolledCourseIdAndAccountId } from "../../../apis/EnrolledCourse/EnrolledCourseApis"
import { getEnrolledLessonByEnrolledLessonIdAndAccountId } from "../../../apis/EnrolledLesson/EnrolledLessonApis"
import { getStudentAttemptByStudentAttemptIdAndAccountId } from "../../../apis/StudentAttempt/StudentAttemptApis";

import {
    ArrowBackward,
    BackBtnWrapper,
    EmptyStateContainer,
    EmptyStateText,
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
        },
        MuiRadio: {
            // root: {
            //     color: 'green',
            // },
            colorSecondary: {
                '&$checked': {
                    color: 'green',
                },
            },
        },
        MuiCheckbox: {
            colorSecondary: {
                '&$checked': {
                    color: 'green',
                },
            },
        },
    }
});


function MarkedQuizComponent(props: any) {

    const enrolledLessonId = props.enrolledLessonId;
    const enrolledCourseId = props.enrolledCourseId;
    const studentAttemptId = props.studentAttemptId;    

    const [studentAttempt, setStudentAttempt] = useState<StudentAttempt>();
    const [studentAttemptQuestions, setStudentAttemptQuestions] = useState<StudentAttemptQuestion[]>([]);

    const [quiz, setQuiz] = useState<Quiz>();

    const history = useHistory();

    const accountId = JSON.parse(window.sessionStorage.getItem("loggedInAccountId") || "{}");

    useEffect(() => {
        getEnrolledCourseByEnrolledCourseIdAndAccountId(enrolledCourseId, accountId)
        .catch((err) => handleError(err));       
    }, [enrolledCourseId, accountId]);

    useEffect(() => {
        getEnrolledLessonByEnrolledLessonIdAndAccountId(enrolledLessonId, accountId)
        .catch((err) => handleError(err));      
    }, [enrolledLessonId, accountId]);

    useEffect(() => {
        getStudentAttemptByStudentAttemptIdAndAccountId(studentAttemptId, accountId).then((studentAttempt: StudentAttempt) => {
            setStudentAttempt(studentAttempt);
            setQuiz(studentAttempt.quiz);
            setStudentAttemptQuestions(studentAttempt.studentAttemptQuestions);
        }).catch((err) => handleError(err));        
    }, [studentAttemptId, accountId]);

    function handleError(err: any): void {
        const errorDataObj = createErrorDataObj(err);
        props.callOpenSnackBar("Error in retrieving student attempt", "error");
        history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj }})
    }

    function createErrorDataObj(err: any): any {
        const errorDataObj = { 
            message1: 'Unable to view student attempt',
            message2: err.response.data.message,
            errorStatus: err.response.status,
            returnPath: '/progresspage',
            returnText: 'My Progress'
        }

        return errorDataObj;
    }

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
                return (studentAnswer.correct ? score = score + studentAnswer.marks : correct = false);
            })
        })
        return `${score}/${totalMarks}`;
    } 

    const getScoreOfStudentAttemptQuestion = (studentAttemptQuestion: StudentAttemptQuestion) => {
        var score: number = 0;

        studentAttemptQuestion.studentAttemptAnswers.forEach((studentAttemptAnswer: StudentAttemptAnswer) => {
            score += studentAttemptAnswer.marks;
        });

        return score;
    }

    const showBackButton = () => {
        return (
            <>
            {(enrolledCourseId && enrolledLessonId) &&
                <BackBtnWrapper>
                    <Link
                        type="button"
                        color="primary"
                        href={`/overview/course/${enrolledCourseId}/lesson/${enrolledLessonId}`}
                    >
                        <ArrowBackward /> Back to Lesson Overview
                    </Link>
                </BackBtnWrapper>
            }
            </>
        )
    }

    const mapQuestionArray = (attemptArray: StudentAttemptQuestion[]) => {
        return (
            <div>
                {attemptArray.map((studentAttempt, qId) => {
                    return (
                        <>
                            <QuizQuestionCard key={qId}>
                                {qId + 1}. {studentAttempt.quizQuestion.content} ({getScoreOfStudentAttemptQuestion(studentAttempt)}/{studentAttempt.quizQuestion.marks} mark{studentAttempt.quizQuestion.marks === 1 ? "" : "s" })
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
                                                <>
                                                    {
                                                        (studentAttempt.studentAttemptAnswers.length === 0) &&
                                                        <EmptyStateContainer>
                                                            <EmptyStateText>
                                                                Question unanswered
                                                                </EmptyStateText>
                                                        </EmptyStateContainer>
                                                    }
                                                    {
                                                        (studentAttempt.studentAttemptAnswers.length > 0) &&
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
                                                </>
                                            }
                                            {
                                                studentAttempt.quizQuestion.questionType === "MATCHING" &&
                                                <>
                                                    {
                                                        (studentAttempt.studentAttemptAnswers.length === 0) &&
                                                        <EmptyStateContainer>
                                                            <EmptyStateText>
                                                                Question unanswered
                                                                    </EmptyStateText>
                                                        </EmptyStateContainer>
                                                    }
                                                    {
                                                        (studentAttempt.studentAttemptAnswers.length > 0) &&
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
                                                    {
                                                        ((studentAttempt.studentAttemptAnswers.length > 0) && (studentAttempt.studentAttemptAnswers.length < studentAttempt.quizQuestion.quizQuestionOptions.length)) &&
                                                        <EmptyStateContainer style={{ alignItems: "flex-end" }}>
                                                            <EmptyStateText>
                                                                {studentAttempt.quizQuestion.quizQuestionOptions.length - studentAttempt.studentAttemptAnswers.length} Set of Matching Not Answered
                                                                    </EmptyStateText>
                                                        </EmptyStateContainer>
                                                    }
                                                </>
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

            { showBackButton() }

            <QuizCard>
                <QuizCardHeader
                    title={quiz !== undefined ? quiz.name : ""}
                />
                <QuizViewerCardContent>
                    {mapQuestionArray(studentAttemptQuestions)}
                </QuizViewerCardContent>
            </QuizCard>
            
            { showBackButton() }
        </>
    );
}

export default MarkedQuizComponent;

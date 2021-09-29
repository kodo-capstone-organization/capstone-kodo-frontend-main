import React, { useEffect, useState } from "react";
import { StudentAttempt } from "../../../apis/Entities/StudentAttempt";
import { StudentAttemptQuestion } from "../../../apis/Entities/StudentAttemptQuestion";
import { QuizQuestion } from "../../../apis/Entities/QuizQuestion";
import { Quiz } from "../../../apis/Entities/Quiz";
import { getStudentAttemptByStudentAttemptId } from "../../../apis/StudentAttempt/StudentAttemptApis";

import {
    QuizContainer, QuizCard, QuizCardHeader, QuizCardContent, QuizQuestionCard,
    QuizViewerCardContent, MarkedQuizViewerTableRow
} from "../QuizViewerElements";
import {
    Grid, Table, TableBody, TableCell, TableContainer, TableHead,
     TableRow, Checkbox, Paper, IconButton, TextField,  Radio,
     makeStyles, createStyles, Theme
} from "@material-ui/core";
import { StudentAttemptAnswer } from "../../../apis/Entities/StudentAttemptAnswer";


const useStyles = makeStyles((theme: Theme) =>
createStyles({
  table: {
    // backgroundColor: "green"
  }
}),
);

function MarkedQuizComponent(props: any) {
    // const studentAttemptId = props.match.params.studentAttemptId;
    const [studentAttemptQuestion, setStudentAttemptQuestion] = useState<StudentAttemptQuestion>();
    const [quizQuestion, setQuizQuestion] = useState<QuizQuestion>();
    const [questionType, setQuestionType] = useState<string>("");
    const [quizQuestionOptions, setQuizQuestionOptions] = useState<QuizQuestionOption[]>([]);
    const [studentAttemptAnswers, setStudentAttemptAnswers] = useState<StudentAttemptAnswer[]>();
    const classes = useStyles();


    useEffect(() => {
        console.log(props.studentAttemptQuestion);
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
            Question: {quizQuestion != undefined && quizQuestion.content}
            <TableContainer component={Paper} style={{ marginTop: "16px" }}>
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
                                <TableRow
                                    key={index}
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
                                </TableRow>
                            ))
                        }
                        {
                            questionType === "MATCHING" &&
                            quizQuestionOptions?.map((row, index) => (
                                <TableRow
                                    key={index}
                                >
                                    <TableCell component="th" scope="row">
                                        <TextField key={index} value={quizQuestionOptions[index].leftContent}/>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <TextField key={index} value={quizQuestionOptions[index].rightContent} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Checkbox
                                            checked={row.correct}
                                            value={index}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default MarkedQuizComponent;

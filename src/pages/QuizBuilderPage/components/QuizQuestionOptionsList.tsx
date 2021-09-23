import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../../../apis/Entities/QuizQuestion';
import { QuizQuestionOption } from '../../../apis/Entities/QuizQuestionOption';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, IconButton, TextField,
    Radio
} from "@material-ui/core";
import { } from "../QuizBuilderElements";

interface IQuestionOption {
    leftContent: string,
    rightContent: (string | null),
    correct: boolean,
    quizQuestionOptionId: number,
}

function QuizQuestionOptionsList(props: any) {

    const [questionType, setQuestionType] = useState<string>();
    const [question, setQuestion] = useState<QuizQuestion>();
    const [quizQuestionOptions, setQuizQuestionOptions] = useState<QuizQuestionOption[]>();
    const [correctAnswer, setCorrectAnswer] = React.useState<number>();
    const [rows, setRows] = useState<IQuestionOption[]>();

    useEffect(() => {
        if (props.question !== undefined) {
            setQuestion(props.question)
            setQuestionType(props.questionType)
            setQuizQuestionOptions(props.question.quizQuestionOptions)
            //@ts-ignore
            props.question.quizQuestionOptions.map((x, index) => {
                return (x.correct ? setCorrectAnswer(index) : null);
            })
        }
    }, [props.question, props.questionType])

    // useEffect(() => {
    //     console.log("quizQuestionOptions", quizQuestionOptions)
    // }, [quizQuestionOptions])

    const handleCorrectAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuizQuestionOptions = quizQuestionOptions?.map((x, index) => {
            return (index === parseInt(event.target.value) ? Object.assign(x, { correct: true })
                : Object.assign(x, { correct: false }));
        });
        setQuizQuestionOptions(newQuizQuestionOptions);
    };

    const handleLeftContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // const newLeftContent = event.target.value
        // const newLeftContentIndex = event.target.key
        // console.log("handleLeftContentChange", newLeftContent)
        // console.log("handleLeftContentChange", newLeftContentIndex)
    }


    return (
        <>
            <TableContainer component={Paper} style={{ marginTop: "16px" }}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {
                                questionType === "MCQ" &&
                                <>
                                    <TableCell>Options</TableCell>
                                    <TableCell align="right">Answer</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </>

                            }
                            {
                                questionType === "TF" &&
                                <>
                                    <TableCell>Options</TableCell>
                                    <TableCell align="right">Answer</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </>

                            }
                            {
                                questionType === "MATCHING" &&
                                <>
                                    <TableCell>LEFT</TableCell>
                                    <TableCell>RIGHT</TableCell>
                                    <TableCell align="right">Answer</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </>

                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            questionType === "MCQ" &&
                            quizQuestionOptions?.map((row, index) => (
                                <TableRow
                                    key={index}
                                >
                                    <TableCell component="th" scope="row">
                                        <TextField key={index} value={row.leftContent} onChange={handleLeftContentChange} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Radio
                                            checked={row.correct}
                                            onChange={handleCorrectAnswerChange}
                                            value={index}
                                        />
                                    </TableCell>
                                    <TableCell align="right"><IconButton><DeleteIcon /></IconButton></TableCell>
                                </TableRow>
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
                                            onChange={handleCorrectAnswerChange}
                                            value={index}
                                        />
                                    </TableCell>
                                    <TableCell align="right"><IconButton disabled><DeleteIcon /></IconButton></TableCell>
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
                                        <TextField key={index} value={row.leftContent} onChange={handleLeftContentChange} />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <TextField key={index} value={row.rightContent} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Radio
                                            checked={row.correct}
                                            onChange={handleCorrectAnswerChange}
                                            value={index}
                                        />
                                    </TableCell>
                                    <TableCell align="right"><IconButton><DeleteIcon /></IconButton></TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default QuizQuestionOptionsList;
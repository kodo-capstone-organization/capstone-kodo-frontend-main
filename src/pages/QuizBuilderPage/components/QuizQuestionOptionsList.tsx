import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../../../apis/Entities/QuizQuestion';
import { QuizQuestionOption } from '../../../apis/Entities/QuizQuestionOption';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, IconButton, TextField,
    Radio
} from "@material-ui/core";
import { } from "../QuizBuilderElements";
import { Button } from "../../../values/ButtonElements";


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
    const [questionIndex, setQuestionIndex] = useState<number>();

    useEffect(() => {
        if (props.question !== undefined) {
            setQuestion(props.question)
            setQuestionType(props.questionType)
            setQuestionIndex(props.questionIndex)
            setQuizQuestionOptions(props.question.quizQuestionOptions)
            //@ts-ignore
            props.question.quizQuestionOptions.map((x, index) => {
                return (x.correct ? setCorrectAnswer(index) : null);
            })
        }
    }, [props.question, props.questionType])

    // useEffect(() => {
    //     props.onHandleQuizQuestionOptionUpdate(quizQuestionOptions, questionIndex)
    // }, [quizQuestionOptions])

    const handleCorrectAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuizQuestionOptions = quizQuestionOptions?.map((x, index) => {
            return (index === parseInt(event.target.value) ? Object.assign(x, { correct: true })
                : Object.assign(x, { correct: false }));
        });
        setQuizQuestionOptions(newQuizQuestionOptions);
        props.onHandleQuizQuestionOptionUpdate(newQuizQuestionOptions, event.target.value)
    };

    const handleLeftContentChange = (event: any) => {
        const newQuizQuestionOptions = quizQuestionOptions?.map((x, index) => {
            return (index === parseInt(event.index) ? Object.assign(x, { leftContent: event.target.value })
                : x)
        });
        setQuizQuestionOptions(newQuizQuestionOptions);
        console.log("option to update", event.target.value)
        if(event.target.value != ""){
            console.log("non-empty option to update", event.target.value)
            props.onHandleQuizQuestionOptionUpdate(newQuizQuestionOptions, questionIndex)
        }
    }

    const handleDeleteOption = (event: React.MouseEvent<unknown>, optionIndex: number) => {
        const newQuizQuestionOptions = quizQuestionOptions?.filter((option, index) => index !== optionIndex);
        setQuizQuestionOptions(newQuizQuestionOptions);
        props.onHandleQuizQuestionOptionUpdate(newQuizQuestionOptions, questionIndex)
    }

    const handleAddOption = (event: React.MouseEvent<unknown>) => {
        var newQuizQuestionOption: QuizQuestionOption;
        if (questionType === "MATCHING") {
            newQuizQuestionOption = {
                quizQuestionOptionId: null,
                leftContent: "",
                rightContent: "",
                correct: false
            };
        } else {
            newQuizQuestionOption = {
                quizQuestionOptionId: null,
                leftContent: "",
                rightContent: null,
                correct: false
            };
        }
        const newQuizQuestionOptions = quizQuestionOptions?.concat([newQuizQuestionOption]);
        setQuizQuestionOptions(newQuizQuestionOptions);
        // props.onHandleQuizQuestionOptionUpdate(newQuizQuestionOptions, questionIndex)

    }


    return (
        <>
            <TableContainer component={Paper} style={{ marginTop: "16px" }}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            {
                                (questionType === "MCQ" || questionType === "TF") &&
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
                                        <TextField value={quizQuestionOptions[index].leftContent} onChange={e => { Object.assign(e, { index }); handleLeftContentChange(e); }} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Radio
                                            checked={row.correct}
                                            onChange={handleCorrectAnswerChange}
                                            value={index}
                                        />
                                    </TableCell>
                                    <TableCell align="right"><IconButton onClick={(event) => handleDeleteOption(event, index)}><DeleteIcon /></IconButton></TableCell>
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
                                        <TextField key={index} value={quizQuestionOptions[index].leftContent} onChange={handleLeftContentChange} />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <TextField key={index} value={quizQuestionOptions[index].rightContent} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Radio
                                            checked={row.correct}
                                            onChange={handleCorrectAnswerChange}
                                            value={index}
                                        />
                                    </TableCell>
                                    <TableCell align="right"><IconButton onClick={(event) => handleDeleteOption(event, index)}><DeleteIcon /></IconButton></TableCell>
                                </TableRow>
                            ))
                        }
                        < TableRow >
                            <Button onClick={handleAddOption}>Add Option</Button>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default QuizQuestionOptionsList;
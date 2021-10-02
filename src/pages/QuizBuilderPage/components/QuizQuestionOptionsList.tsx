import React, { useState, useEffect } from 'react';

import DeleteIcon from '@material-ui/icons/Delete';
import {
    Checkbox,
    IconButton,
    Paper,
    Radio,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@material-ui/core";

import { QuizQuestionOption } from '../../../apis/Entities/QuizQuestionOption';

import { AddQuizOptionButton } from "../QuizBuilderElements";

function QuizQuestionOptionsList(props: any) {

    const [questionType, setQuestionType] = useState<string>();
    const [quizQuestionOptions, setQuizQuestionOptions] = useState<QuizQuestionOption[]>();
    // const [correctAnswer, setCorrectAnswer] = React.useState<number>();
    const [questionIndex, setQuestionIndex] = useState<number>();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (props.question !== undefined) {
            setQuestionType(props.questionType);
            setQuestionIndex(props.questionIndex);
            setQuizQuestionOptions(props.question.quizQuestionOptions);
            setIsDisabled(props.disabled);
            if (props.question.quizQuestionOptions.length === 0) {
                var newQuizQuestionOptions: QuizQuestionOption[];
                if (props.questionType === "TF") {
                    const trueOption: QuizQuestionOption = {
                        quizQuestionOptionId: null,
                        leftContent: "true",
                        rightContent: null,
                        correct: true
                    };
                    const falseOption: QuizQuestionOption = {
                        quizQuestionOptionId: null,
                        leftContent: "false",
                        rightContent: null,
                        correct: false
                    };
                    newQuizQuestionOptions = [trueOption, falseOption];
                    console.log('tf', newQuizQuestionOptions);
                    setQuizQuestionOptions(newQuizQuestionOptions);
                } else if (props.questionType === "MCQ") {
                    const defaultOption: QuizQuestionOption = {
                        quizQuestionOptionId: null,
                        leftContent: "MCQ OPTION",
                        rightContent: null,
                        correct: true
                    };
                    newQuizQuestionOptions = [defaultOption];
                    console.log('mcq', newQuizQuestionOptions);
                    setQuizQuestionOptions(newQuizQuestionOptions);
                } else if (props.questionType === "MATCHING") {
                    const defaultOption: QuizQuestionOption = {
                        quizQuestionOptionId: null,
                        leftContent: "MATCHING OPTION A",
                        rightContent: "MATCHING OPTION B",
                        correct: true
                    };
                    newQuizQuestionOptions = [defaultOption];
                    console.log('match', newQuizQuestionOptions);
                    setQuizQuestionOptions(newQuizQuestionOptions);
                }
                props.onHandleQuizQuestionOptionUpdate(newQuizQuestionOptions, props.questionIndex)
            }
        }
    }, [props.question, props.questionType, props.disabled, props.questionIndex])

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
        if (event.target.value !== "") {
            props.onHandleQuizQuestionOptionUpdate(newQuizQuestionOptions, questionIndex)
        }
    }

    const handleRightContentChange = (event: any) => {
        const newQuizQuestionOptions = quizQuestionOptions?.map((x, index) => {
            return (index === parseInt(event.index) ? Object.assign(x, { rightContent: event.target.value })
                : x)
        });
        setQuizQuestionOptions(newQuizQuestionOptions);
        if (event.target.value !== "") {

            props.onHandleQuizQuestionOptionUpdate(newQuizQuestionOptions, questionIndex)
        }
    }

    const handleDeleteOption = (event: React.MouseEvent<unknown>, optionIndex: number) => {
        const optionToDelete = quizQuestionOptions[optionIndex];
        if(optionToDelete.correct === true && questionType === "MCQ"){
            handleCallSnackbar("Cannot delete correct option");
        } else if (quizQuestionOptions.length > 1) {
            var newQuizQuestionOptions = quizQuestionOptions?.filter((option, index) => index !== optionIndex);
            if (newQuizQuestionOptions.length === 1) {
                newQuizQuestionOptions = newQuizQuestionOptions?.map((option) => Object.assign(option, { correct: true }));
            }
            setQuizQuestionOptions(newQuizQuestionOptions);
            props.onHandleQuizQuestionOptionUpdate(newQuizQuestionOptions, questionIndex)
        } else {
            handleCallSnackbar("Each Question Must Have At Least 1 Option");
        }
    }

    const handleAddOption = (event: React.MouseEvent<unknown>) => {
        var newQuizQuestionOption: QuizQuestionOption;
        if (questionType === "MATCHING") {
            newQuizQuestionOption = {
                quizQuestionOptionId: null,
                leftContent: "MATCHING OPTION A",
                rightContent: "MATCHING OPTION B",
                correct: true
            };
        } else {
            newQuizQuestionOption = {
                quizQuestionOptionId: null,
                leftContent: "NEW MCQ OPTION",
                rightContent: null,
                correct: false
            };
        }
        const newQuizQuestionOptions = quizQuestionOptions?.concat([newQuizQuestionOption]);
        setQuizQuestionOptions(newQuizQuestionOptions);
    }

    const handleCallSnackbar = (msg: string) => {
        props.onCallSnackbar(msg)
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
                                        <TextField disabled={isDisabled} value={quizQuestionOptions[index].leftContent} onChange={e => { Object.assign(e, { index }); handleLeftContentChange(e); }} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Radio
                                            disabled={isDisabled}
                                            checked={row.correct}
                                            onChange={handleCorrectAnswerChange}
                                            value={index}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton disabled={isDisabled} onClick={(event) => handleDeleteOption(event, index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
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
                                            disabled={isDisabled}
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
                                        <TextField disabled={isDisabled} key={index} value={quizQuestionOptions[index].leftContent} onChange={e => { Object.assign(e, { index }); handleLeftContentChange(e); }} />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <TextField disabled={isDisabled} key={index} value={quizQuestionOptions[index].rightContent} onChange={e => { Object.assign(e, { index }); handleRightContentChange(e); }} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton disabled={isDisabled} onClick={(event) => handleDeleteOption(event, index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {
                !isDisabled && (questionType === "MCQ" || questionType === "MATCHING") &&
                <>
                    <br />
                    <AddQuizOptionButton disabled={isDisabled} onClick={handleAddOption}>Add Option</AddQuizOptionButton>
                </>
            }
        </>
    )
}

export default QuizQuestionOptionsList;
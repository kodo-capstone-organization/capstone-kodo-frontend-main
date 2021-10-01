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

import { QuizQuestion } from '../../../apis/Entities/QuizQuestion';
import { QuizQuestionOption } from '../../../apis/Entities/QuizQuestionOption';

import { AddQuizOptionButton } from "../QuizBuilderElements";


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
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (props.question !== undefined) {
            setQuestion(props.question);
            setQuestionType(props.questionType);
            setQuestionIndex(props.questionIndex);
            setQuizQuestionOptions(props.question.quizQuestionOptions);
            setIsDisabled(props.disabled);
            //@ts-ignore
            props.question.quizQuestionOptions.map((x, index) => {
                return (x.correct ? setCorrectAnswer(index) : null);
            })
            if (props.questionType === "TF") {
                //check if options are TF, if not repopulate options
                if (props.question.quizQuestionOptions.length >= 0) {
                    if (props.question.quizQuestionOptions.length[0] !== "true" || props.question.quizQuestionOptions.length[0] !== "false") {
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
                        const newQuizQuestionOptions: QuizQuestionOption[] = [trueOption, falseOption];
                        setQuizQuestionOptions(newQuizQuestionOptions);
                    }
                }
            }
            // else { // add question prompt
            //     const adderOption: QuizQuestionOption = {
            //         quizQuestionOptionId: null,
            //         leftContent: "",
            //         rightContent: "",
            //         correct: false
            //     };
            //     const newQuizQuestionOptions: QuizQuestionOption[] = props.question.quizQuestionOptions.concat([adderOption]);
            //     setQuizQuestionOptions(newQuizQuestionOptions);
            // }
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

    const handleMatchingCorrectAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuizQuestionOptions = quizQuestionOptions?.map((x, index) => {
            return (index === parseInt(event.target.value) ? Object.assign(x, { correct: !x.correct })
                : x);
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
        if (event.target.value !== "") {
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
                                        <TextField disabled={isDisabled} key={index} value={quizQuestionOptions[index].leftContent} onChange={handleLeftContentChange} />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <TextField disabled={isDisabled} key={index} value={quizQuestionOptions[index].rightContent} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Checkbox
                                            disabled={isDisabled}
                                            checked={row.correct}
                                            onChange={handleMatchingCorrectAnswerChange}
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
                    </TableBody>
                </Table>
            </TableContainer>
            {
                (questionType === "MCQ" || questionType === "MATCHING") &&
                <AddQuizOptionButton disabled={isDisabled} onClick={handleAddOption}>Add Option</AddQuizOptionButton>
            }
        </>
    )
}

export default QuizQuestionOptionsList;
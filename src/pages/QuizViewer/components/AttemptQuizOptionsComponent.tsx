import React, { useState, useEffect } from 'react';

import {
    MenuItem,
    Paper,     
    Radio, 
    Select, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
} from "@material-ui/core";

import { QuizQuestion } from '../../../apis/Entities/QuizQuestion';


function AttemptQuizOptionsComponent(props: any) {

    const [question, setQuestion] = useState<QuizQuestion>();
    const [questionIndex, setQuestionIndex] = useState<number>();
    const [selectedOptionArray, setSelectedOptionArray] = useState<number[]>([]);
    const [rightSelected, setRightSelected] = useState<any>("");


    useEffect(() => {
        if (props.question) {
            setQuestion(props.question);
            setQuestionIndex(props.index);
            console.log(props.question);
        }
    }, [props.question])

    const handleOptionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (question)
        {
            const value = parseInt(event.target.value);
            var newOptionArray: number[];
            if (question.questionType === "MCQ" || question.questionType === "TF") {
                newOptionArray = [value];
            } else if (question.questionType === "MATCHING") {
                if (!selectedOptionArray.includes(value)) {
                    newOptionArray = selectedOptionArray.concat([value]);
                } else {
                    newOptionArray = selectedOptionArray.filter(x => x !== value);
                }
            } else {
                newOptionArray = [];
            }
            setSelectedOptionArray(newOptionArray);
            props.onHandleAttemptAnswer([newOptionArray], questionIndex);
        }
    }

    const handleSelectorChange = (event: any, index: number) => {
        if (question) {
            var newOptionArray = [];
            const rightOptionId = event.target.value;
            const leftOptionId = question.quizQuestionOptions[index].quizQuestionOptionId;
            const combinedOption = [leftOptionId, rightOptionId];

            newOptionArray = selectedOptionArray.filter((selectedOption: number) => selectedOption !== leftOptionId);
            newOptionArray = newOptionArray.concat(combinedOption);
            setSelectedOptionArray(newOptionArray);
            props.onHandleAttemptAnswer(newOptionArray, questionIndex);
        }
    }


    return (
        <>
            { question &&
                <TableContainer component={Paper} style={{ marginTop: "16px" }}>
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
                                        <TableCell align="right">RIGHT</TableCell>
                                    </>

                                }
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {
                                question.questionType === "MCQ" &&
                                question.quizQuestionOptions?.map((row, index) => {
                                    if (row.quizQuestionOptionId !== null) {
                                        <TableRow
                                            key={index}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.leftContent}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Radio
                                                    checked={selectedOptionArray.includes(row.quizQuestionOptionId)}
                                                    value={row.quizQuestionOptionId}
                                                    onChange={handleOptionsChange}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    }
                                })

                            }

                            {
                                question.questionType === "TF" &&
                                question.quizQuestionOptions?.map((row, index) => {
                                    if (row.quizQuestionOptionId !== null) {
                                        <TableRow
                                            key={index}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.leftContent}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Radio
                                                    checked={selectedOptionArray.includes(row.quizQuestionOptionId)}
                                                    value={row.quizQuestionOptionId}
                                                    onChange={handleOptionsChange}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    }
                                })
                            }
                            {
                                question.questionType === "MATCHING" &&
                                question.quizQuestionOptions?.map((row, index) => (
                                    <TableRow
                                        key={index}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.leftContent}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="right">
                                            <Select
                                                value={rightSelected[index]}
                                                onChange={(e) => handleSelectorChange(e, index)}
                                            >
                                                {
                                                    question.quizQuestionOptions?.map((row, index) => {
                                                        if (row.quizQuestionOptionId)
                                                        {
                                                            return (<MenuItem value={row.quizQuestionOptionId} key={index}>{row.rightContent}</MenuItem>);
                                                        }                                                        
                                                    })
                                                }
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </>
    )
}

export default AttemptQuizOptionsComponent;
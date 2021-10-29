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

import { QuizQuestion } from '../../../entities/QuizQuestion';

const shuffleArray = (array: any[]) => {
    var shuffled: any[] = array;
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
}

function AttemptQuizOptionsComponent(props: any) {

    const [question, setQuestion] = useState<QuizQuestion>();
    const [questionIndex, setQuestionIndex] = useState<number>();
    const [optionArrayToUpdate, setOptionArrayToUpdate] = useState<number[][]>([]);
    const [selectedOptionArray, setSelectedOptionArray] = useState<any[]>([]);
    const [rightSelected, setRightSelected] = useState<any>("");


    useEffect(() => {
        if (props.question) {
            const shuffledOptionList = shuffleArray(props.question.quizQuestionOptions.slice(0));
            const questionWithShuffledOptionList = Object.assign(props.question, {quizQuestionOptions: shuffledOptionList});
            setQuestion(questionWithShuffledOptionList);
            setQuestionIndex(props.index);
        }
    }, [props.question])

    const handleOptionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        var newOptionArray : number[] = [];
        if (question?.questionType === "MCQ" || question?.questionType === "TF") {
            newOptionArray = [value];
        } else if (question?.questionType === "MATCHING") {
            if (!selectedOptionArray.includes(value)) {
                newOptionArray = selectedOptionArray.concat([value]);
            } else {
                newOptionArray = selectedOptionArray.filter(x => x !== value);
            }
        }
        setSelectedOptionArray(newOptionArray);
        setOptionArrayToUpdate([newOptionArray]);
        props.onHandleAttemptAnswer([newOptionArray], questionIndex);
    }

    const handleSelectorChange = (event: React.ChangeEvent<{ value: unknown }>, index: number) => {
        var newOptionArray = [];
        const rightOptionId = event.target.value;
        const leftOptionId = question?.quizQuestionOptions[index].quizQuestionOptionId;
        const combinedOption = [leftOptionId, rightOptionId];
        console.log("combinedOption", combinedOption)

        console.log("1", selectedOptionArray)
        newOptionArray = selectedOptionArray.filter((selectedOption) => selectedOption[0] !== leftOptionId);
        console.log("2", newOptionArray)
        newOptionArray = newOptionArray.concat([combinedOption]);
        console.log("3", newOptionArray)
        setSelectedOptionArray(newOptionArray);
        setOptionArrayToUpdate(newOptionArray);
        props.onHandleAttemptAnswer(newOptionArray, questionIndex);

    }


    return (
        <>
            <TableContainer component={Paper} style={{ marginTop: "16px" }}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            {
                                (question?.questionType === "MCQ" || question?.questionType === "TF") &&
                                <>
                                    <TableCell>Options</TableCell>
                                    <TableCell align="right">Answer</TableCell>
                                </>

                            }
                            {
                                question?.questionType === "MATCHING" &&
                                <>
                                    <TableCell>LEFT</TableCell>
                                    <TableCell align="right">RIGHT</TableCell>
                                </>

                            }
                        </TableRow>
                    </TableHead>


                    <TableBody>
                        {
                            question?.questionType === "MCQ" &&
                            question?.quizQuestionOptions?.map((row, index) => (
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
                            ))

                        }

                        {
                            question?.questionType === "TF" &&
                            question?.quizQuestionOptions?.map((row, index) => (
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
                            ))
                        }
                        {
                            question?.questionType === "MATCHING" &&
                            question?.quizQuestionOptions?.map((row, index) => (
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
                                                    return (<MenuItem value={row.quizQuestionOptionId != null ? row.quizQuestionOptionId : undefined} key={index}>{row.rightContent}</MenuItem>);
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
        </>
    )
}

export default AttemptQuizOptionsComponent;
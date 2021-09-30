import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../../../apis/Entities/QuizQuestion';
import { QuizQuestionOption } from '../../../apis/Entities/QuizQuestionOption';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, IconButton, TextField,
    Radio
} from "@material-ui/core";
import { AddQuizOptionButton } from "../QuizBuilderElements";
import { Button } from "../../../values/ButtonElements";


function AttemptQuizOptionsComponent(props: any) {

    const [question, setQuestion] = useState<QuizQuestion>({});
    const [questionIndex, setQuestionIndex] = useState<number>();
    const [selectedOptionArray, setSelectedOptionArray] = useState<number[]>([]);


    useEffect(() => {
        if (props.question) {
            setQuestion(props.question);
            setQuestionIndex(props.index);
        }
    }, [props.question])

    // useEffect(() => {
    //     console.log("selectedOptionArray", selectedOptionArray);
    // }, [selectedOptionArray])

    const handleOptionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        var newOptionArray;
        if (question.questionType === "MCQ" || question.questionType === "TF") {
            newOptionArray = [value];
        } else if (question.questionType === "MATCHING") {
            var newOptionArray;
            if (!selectedOptionArray.includes(value)) {
                newOptionArray = selectedOptionArray.concat([value]);
            } else {
                newOptionArray = selectedOptionArray.filter(x => x != value);
            }
        }
        setSelectedOptionArray(newOptionArray);
        props.onHandleAttemptAnswer(newOptionArray, questionIndex);
    }


    return (
        <>
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
                            question.questionType === "TF" &&
                            question.quizQuestionOptions?.map((row, index) => (
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
                            question.questionType === "MATCHING" &&
                            question.quizQuestionOptions?.map((row, index) => (
                                <TableRow
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
                                            checked={selectedOptionArray.includes(row.quizQuestionOptionId)}
                                            value={row.quizQuestionOptionId}
                                            onChange={handleOptionsChange}
                                        />
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
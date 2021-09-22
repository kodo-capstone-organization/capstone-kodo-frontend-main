import React, { useState, useEffect } from 'react';
import { Quiz } from '../../../apis/Entities/Quiz';
import { QuizQuestion } from '../../../apis/Entities/QuizQuestion';
import { QuizQuestionOption } from '../../../apis/Entities/QuizQuestionOption';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, IconButton, TextField,
    Radio
} from "@material-ui/core";
import { QuizContainer, QuizCard, QuizBuilderTextInput, QuizSelectMenu, QuizQuestionCard } from "./../QuizBuilderElements";
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';


function createMCQ(
    option: string,
    answer: boolean,
) {
    return { option, answer };
}

function createTrueFalse(
    option: string,
    answer: boolean,
) {
    return { option, answer };
}

function createOption(
    leftContent: string,
    rightContent: (string | null),
    correct: boolean,
    quizQuestionOptionId: number,
) {
    return { leftContent, rightContent, correct, quizQuestionOptionId };
}

interface IQuestionOption {
    leftContent: string,
    rightContent: (string | null),
    correct: boolean,
    quizQuestionOptionId: number,
}

const MCQRows = [
    createMCQ('new array = [1,2,3]', true),
    createMCQ('new array = {1,2,3}', false)
];

const trueFalseRows = [
    createTrueFalse('True', true),
    createTrueFalse('False', false)
];

// function createMatching(
//     leftSide: string,
//     rightSide: boolean,
// ) {
//     return { leftSide, rightSide };
// }

// const matchingRows = [
//     createMatching('True', true),
//     createMatching('False', false)
// ];


function QuizQuestionOptions(props: any) {

    const [questionType, setQuestionType] = useState<string>();
    const [question, setQuestion] = useState<QuizQuestion>();
    const [quizQuestionOptions, setQuizQuestionOptions] = useState<QuizQuestionOption[]>();
    const [selectedTrueFalse, setSelectedTrueFalse] = React.useState(true);
    const [rows, setRows] = useState<IQuestionOption[]>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === "false") {
            setSelectedTrueFalse(false);
        } else {
            setSelectedTrueFalse(true);
        }
    };

    useEffect(() => {
        if (props.question != undefined) {
            setQuestion(props.question)
            setQuestionType(props.question.questionType)
            setQuizQuestionOptions(props.question.quizQuestionOptions)
            // props.question.quizQuestionOptions.map((option : QuizQuestionOption) => {
            //     const new 
            // })
        }
    }, [props.question])


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
                                questionType === "True/False" &&
                                <>
                                    <TableCell>Options</TableCell>
                                    <TableCell align="right">Answer</TableCell>
                                </>

                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                            questionType === "MCQ" && 
                            quizQuestionOptions?.map((row) => (
                                <TableRow
                                    key={row.quizQuestionOptionId}
                                >
                                    <TableCell component="th" scope="row">
                                        <TextField value={row.leftContent} />
                                    </TableCell>
                                    <TableCell align="right">{row.correct ? <Checkbox defaultChecked /> : <Checkbox />}</TableCell>
                                    <TableCell align="right"><IconButton><DeleteIcon /></IconButton></TableCell>
                                </TableRow>
                            ))}

                        {
                            questionType === "True/False" &&
                            quizQuestionOptions?.map((row) => (
                                <TableRow
                                    key={row.quizQuestionOptionId}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.leftContent}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Radio
                                            checked={row.correct}
                                            onChange={handleChange}
                                            value={row.leftContent}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default QuizQuestionOptions;
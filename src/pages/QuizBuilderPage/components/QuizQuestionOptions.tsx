import React, { useState, useEffect } from 'react';
import { Quiz } from '../../../apis/Entities/Quiz';
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

const MCQRows = [
    createMCQ('new array = [1,2,3]', true),
    createMCQ('new array = {1,2,3}', false)
];

function createTrueFalse(
    option: string,
    answer: boolean,
) {
    return { option, answer };
}

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

    const [type, setType] = useState<string>("");
    const [selectedTrueFalse, setSelectedTrueFalse] = React.useState(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === "false") {
            setSelectedTrueFalse(false);
        } else {
            setSelectedTrueFalse(true);
        }
    };

    useEffect(() => {
        setType(props.type)
    }, [props.type])


    return (
        <>
            <TableContainer component={Paper} style={{ marginTop: "16px" }}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {
                                type === "mcq" &&
                                <>
                                    <TableCell>Options</TableCell>
                                    <TableCell align="right">Answer</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </>

                            }
                            {
                                type === "truefalse" &&
                                <>
                                    <TableCell>Options</TableCell>
                                    <TableCell align="right">Answer</TableCell>
                                </>

                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            type === "mcq" &&
                            MCQRows.map((row) => (
                                <TableRow
                                    key={row.option}
                                >
                                    <TableCell component="th" scope="row">
                                        <TextField value={row.option} />
                                    </TableCell>
                                    <TableCell align="right">{row.answer ? <Checkbox defaultChecked /> : <Checkbox />}</TableCell>
                                    <TableCell align="right"><IconButton><DeleteIcon /></IconButton></TableCell>
                                </TableRow>
                            ))}

                        {
                            type === "truefalse" &&
                            trueFalseRows.map((row) => (
                                <TableRow
                                    key={row.option}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.option}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Radio
                                            checked={selectedTrueFalse === row.answer}
                                            onChange={handleChange}
                                            value={row.answer}
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
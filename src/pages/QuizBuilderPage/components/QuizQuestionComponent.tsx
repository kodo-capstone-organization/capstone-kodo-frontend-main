import React, { useState, useEffect } from 'react';
import { Quiz } from '../../../apis/Entities/Quiz';
import QuizQuestionOptions from "./QuizQuestionOptions"
import {
    Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, TextField, Typography, Divider
} from "@material-ui/core";
import { QuizContainer, QuizCard, QuizBuilderTextInput, QuizSelectMenu, QuizQuestionCard } from "../QuizBuilderElements";


const questionTypes = [
    'MCQ',
    'True/False',
    'Matching'
];


function QuizQuestionComponent(props: any) {

    const [quiz, setQuiz] = useState<Quiz>();
    const [type, setType] = useState<string>("mcq");
    const [mark, setMark] = useState<number>();
    // const [type, setType] = useState<string>("");

    const [description, setDescription] = useState<string>("");


    useEffect(() => {
    }, [])

    const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setType(event.target.value as string);
    };

    const handleMarkChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setMark(event.target.value as number);
    };

    return (
        <>

            <QuizQuestionCard>
                <div id="typeAndMark" style={{ display: "flex", justifyContent: "center" }}>
                    <Box sx={{ minWidth: 120 }} style={{ margin: "16px" }}>
                        <FormControl fullWidth>
                            <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                Question Type
                        </InputLabel>
                            <QuizSelectMenu
                                value={type}
                                onChange={handleTypeChange}
                            >
                                <option value={"mcq"}>MCQ</option>
                                <option value={"truefalse"}>True/False</option>
                                <option value={"matching"}>Matching</option>
                            </QuizSelectMenu>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 120 }} style={{ margin: "16px" }}>
                        <FormControl fullWidth>
                            <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                Marks
                        </InputLabel>
                            <QuizSelectMenu
                                value={mark}
                                onChange={handleMarkChange}
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={3}>4</option>
                                <option value={3}>5</option>
                            </QuizSelectMenu>
                        </FormControl>
                    </Box>
                </div>

                <Divider />


                <QuizBuilderTextInput id="standard-basic" label="Question" variant="standard" />

                <Divider />
                <QuizQuestionOptions type={type} />
                {/* <QuizQuestionOptions type={"mcq"} />
                <QuizQuestionOptions type={"truefalse"} />
                <QuizQuestionOptions type={"match"} /> */}

                <Divider />
            </QuizQuestionCard>

        </>
    )
}

export default QuizQuestionComponent;
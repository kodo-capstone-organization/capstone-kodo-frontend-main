import React, { useState, useEffect } from 'react';
import { Quiz } from '../../../apis/Entities/Quiz';
import { QuizQuestion } from "../../../apis/Entities/QuizQuestion";
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
    const [questionType, setQuestionType] = useState<string>();
    const [marks, setMarks] = useState<number>();
    const [question, setQuestion] = useState<QuizQuestion>();
    const [content, setContent] = useState<string>();

    const [description, setDescription] = useState<string>("");


    useEffect(() => {
        setQuestion(props.question)
        setContent(props.question.content)
        setMarks(props.question.marks)
        setQuestionType(props.question.questionType)
    }, [props.question])

    const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setQuestionType(event.target.value as string);
    };

    const handleMarkChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setMarks(event.target.value as number);
    };

    const handleContentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setContent(event.target.value as string);
    };

    return (
        <>

            <div id="questioncomponent" style={{ width: "inherit" }}>
                <div id="typeAndMark" style={{ display: "flex", justifyContent: "center" }}>

                    {
                        questionType != undefined &&
                        <Box sx={{ minWidth: 120 }} style={{ margin: "16px" }}>
                            <FormControl fullWidth>
                                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                    Question Type
                                </InputLabel>
                                <QuizSelectMenu
                                    value={questionType}
                                    onChange={handleTypeChange}
                                >
                                    <option value={"MCQ"}>MCQ</option>
                                    <option value={"True/False"}>True/False</option>
                                    <option value={"Matching"}>Matching</option>
                                </QuizSelectMenu>
                            </FormControl>
                        </Box>
                    }

                    {
                        marks != undefined &&
                        <Box sx={{ minWidth: 120 }} style={{ margin: "16px" }}>
                            <FormControl fullWidth>
                                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                    Marks
                    </InputLabel>
                                <QuizSelectMenu
                                    value={marks}
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
                    }

                </div>

                <Divider />

                {
                    content != undefined &&
                    <QuizBuilderTextInput id="standard-basic" label="Question" variant="standard" value={content} onChange={handleContentChange}/>

                }

                <Divider />
                <QuizQuestionOptions question={question} />
                {/* <QuizQuestionOptions type={"mcq"} />
                <QuizQuestionOptions type={"truefalse"} />
                <QuizQuestionOptions type={"match"} /> */}

                <Divider />
            </div>

        </>
    )
}

export default QuizQuestionComponent;
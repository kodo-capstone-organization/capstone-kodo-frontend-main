import React, { useState, useEffect } from 'react';

import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import {
    Box,
    FormControl,
    IconButton,
    InputLabel,
    Chip
} from "@material-ui/core";

import { QuizQuestion } from "../../../apis/Entities/QuizQuestion";
import { QuizQuestionOption } from '../../../apis/Entities/QuizQuestionOption';

import QuizQuestionOptionsList from "./QuizQuestionOptionsList"
import {
    QuizBuilderTextInput,
    QuizSelectMenu
} from "../QuizBuilderElements";


function QuizQuestionComponent(props: any) {

    const [questionType, setQuestionType] = useState<string>();
    const [marks, setMarks] = useState<number>();
    const [question, setQuestion] = useState<QuizQuestion>();
    // const [updatedQuestion, setUpdatedQuestion] = useState<QuizQuestion>();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");
    const [questionIndex, setQuestionIndex] = useState<number>();

    useEffect(() => {
        setQuestion(props.question)
        setIsDisabled(props.disabled)
        setQuestionIndex(props.questionIndex)
        setContent(props.question.content)
        setMarks(props.question.marks)
        setQuestionType(props.question.questionType)
    }, [props.question])

    const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setQuestionType(event.target.value as string);
        const newlyUpdatedQuestion = Object.assign(question, { questionType: event.target.value, quizQuestionOptions: [] })
        console.log("newlyUpdatedQuestion", newlyUpdatedQuestion);
        props.onUpdateQuestion(newlyUpdatedQuestion, questionIndex)
    };

    const handleMarkChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setMarks(event.target.value as number);
        const newlyUpdatedQuestion = Object.assign(question, { marks: event.target.value })
        props.onUpdateQuestion(newlyUpdatedQuestion, questionIndex)
    };

    const handleContentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setContent(event.target.value as string);
        const newlyUpdatedQuestion = Object.assign(question, { content: event.target.value })
        props.onUpdateQuestion(newlyUpdatedQuestion, questionIndex)
    };

    const handleQuizQuestionOptionUpdate = (quizQuestionOptions: QuizQuestionOption[], questionIndex: number) => {
        //recv data from child component
        const newlyUpdatedQuestion = Object.assign(question, { quizQuestionOptions })
        props.onUpdateQuizQuestionOptions(newlyUpdatedQuestion, questionIndex)
    }

    const deleteQuestion = () => {
        props.onUpdateQuestion(null, questionIndex)
    }

    const handleCallSnackbar = (msg: string) => {
        props.onCallSnackbar(msg);
    }

    const formatQuestionType = (questionType: string) => {
        if (questionType === "TF") {
            return "True/False";
        } else {
            return questionType;
        }
    }

    return (
        <>
            <div id="questioncomponent" style={{ width: "inherit", textAlign: "center" }}>
                <DragHandleIcon/>
                <div id="typeAndMark" style={{ display: "flex", justifyContent: "center" }}>
                    {
                        marks !== undefined &&
                        <Box sx={{ minWidth: 120 }} style={{ margin: "6px" }}>
                            <FormControl fullWidth>
                                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                    Marks
                                </InputLabel>
                                <QuizSelectMenu
                                    disabled={isDisabled}
                                    value={marks}
                                    onChange={handleMarkChange}
                                >
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                </QuizSelectMenu>
                            </FormControl>
                        </Box>
                    }
                    &nbsp;&nbsp;&nbsp;
                    {
                        questionType !== undefined &&
                        <Box sx={{ minWidth: 120 }} style={{ margin: "6px" }}>
                            <Chip label={formatQuestionType(questionType)} />
                        </Box>
                    }
                    <IconButton disabled={isDisabled} style={{ alignItems: "baseline", marginLeft: "auto" }} onClick={deleteQuestion}>
                        <DeleteIcon />
                    </IconButton>
                </div>

                <br />

                <div>
                    {
                        content !== undefined &&
                        <QuizBuilderTextInput disabled={isDisabled} id="question-input" label="Question" variant="standard" value={content} onChange={handleContentChange} />
                    }
                </div>

                <br />

                <QuizQuestionOptionsList disabled={isDisabled} questionIndex={questionIndex} question={question} questionType={questionType}
                    onHandleQuizQuestionOptionUpdate={handleQuizQuestionOptionUpdate} onCallSnackbar={handleCallSnackbar} />
            </div>

        </>
    )
}

export default QuizQuestionComponent;
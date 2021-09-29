import React, { useState, useEffect } from 'react';
import { Quiz } from '../../../apis/Entities/Quiz';
import { QuizQuestion } from "../../../apis/Entities/QuizQuestion";
import { QuizQuestionOption } from '../../../apis/Entities/QuizQuestionOption';
import QuizQuestionOptionsList from "./QuizQuestionOptionsList"
import {
    Box, FormControl, InputLabel, Divider, IconButton
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import { QuizBuilderTextInput, QuizSelectMenu } from "../QuizBuilderElements";


const questionTypes = [
    'MCQ',
    'TF',
    'MATCHING'
];


function QuizQuestionComponent(props: any) {

    const [quiz, setQuiz] = useState<Quiz>();
    const [questionType, setQuestionType] = useState<string>();
    const [marks, setMarks] = useState<number>();
    const [question, setQuestion] = useState<QuizQuestion>();
    const [updatedQuestion, setUpdatedQuestion] = useState<QuizQuestion>();
    const [content, setContent] = useState<string>();
    const [questionIndex, setQuestionIndex] = useState<number>();

    useEffect(() => {
        setQuestion(props.question)
        setUpdatedQuestion(props.question)
        setQuestionIndex(props.questionIndex)
        setContent(props.question.content)
        setMarks(props.question.marks)
        setQuestionType(props.question.questionType)
    }, [props.question])

    // useEffect(() => {
    //     console.log("handleTYpechange", updatedQuestion)

    // }, [updatedQuestion])

    const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setQuestionType(event.target.value as string);
        const newlyUpdatedQuestion = Object.assign(updatedQuestion, { questionType: event.target.value })
        setUpdatedQuestion(newlyUpdatedQuestion)
        props.onUpdateQuestion(newlyUpdatedQuestion, questionIndex)
    };

    const handleMarkChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setMarks(event.target.value as number);
        const newlyUpdatedQuestion = Object.assign(updatedQuestion, { marks: event.target.value })
        setUpdatedQuestion(newlyUpdatedQuestion)
        props.onUpdateQuestion(newlyUpdatedQuestion, questionIndex)
    };

    const handleContentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setContent(event.target.value as string);
        const newlyUpdatedQuestion = Object.assign(updatedQuestion, { content: event.target.value })
        setUpdatedQuestion(newlyUpdatedQuestion)
        props.onUpdateQuestion(newlyUpdatedQuestion, questionIndex)
    };

    const handleQuizQuestionOptionUpdate = (quizQuestionOptions: QuizQuestionOption[], questionIndex: number) => {
        //recv data from child component
        const newlyUpdatedQuestion = Object.assign(updatedQuestion, { quizQuestionOptions })
        props.onUpdateQuizQuestionOptions(newlyUpdatedQuestion, questionIndex)
    }

    const deleteQuestion = () => {
        // const updatedQuizQuestionArray = quizQuestionArray.filter((q, qId) => { return (qId !== index); })
        // setQuizQuestionArray(updatedQuizQuestionArray);
        props.onUpdateQuestion(null, questionIndex)

    }

    return (
        <>

            <div id="questioncomponent" style={{ width: "inherit" }}>
                <div id="typeAndMark" style={{ display: "flex", justifyContent: "center" }}>

                    {
                        questionType != undefined &&
                        <Box sx={{ minWidth: 120 }} style={{ margin: "6px" }}>
                            <FormControl fullWidth>
                                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                    Question Type
                                </InputLabel>
                                <QuizSelectMenu
                                    value={questionType}
                                    onChange={handleTypeChange}
                                >
                                    <option value={"MCQ"}>MCQ</option>
                                    <option value={"TF"}>True/False</option>
                                    <option value={"MATCHING"}>Matching</option>
                                </QuizSelectMenu>
                            </FormControl>
                        </Box>
                    }

                    {
                        marks != undefined &&
                        <Box sx={{ minWidth: 120 }} style={{ margin: "6px" }}>
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
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                </QuizSelectMenu>
                            </FormControl>
                        </Box>
                    }
                    <IconButton style={{ alignItems: "baseline", marginLeft:"auto" }} onClick={deleteQuestion}>
                        <DeleteIcon />
                    </IconButton>
                </div>

                <Divider />

                {
                    content != undefined &&
                    <QuizBuilderTextInput id="standard-basic" label="Question" variant="standard" value={content} onChange={handleContentChange} />

                }

                <Divider />
                <QuizQuestionOptionsList questionIndex={questionIndex} question={question} questionType={questionType} onHandleQuizQuestionOptionUpdate={handleQuizQuestionOptionUpdate} />
                <Divider />
            </div>

        </>
    )
}

export default QuizQuestionComponent;
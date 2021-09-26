import React, { useState, useEffect } from 'react';
import { Quiz } from './../../apis/Entities/Quiz';
import { QuizQuestion } from "../../apis/Entities/QuizQuestion";
import { getQuizByQuizId, updateQuizWithQuizQuestionsAndQuizQuestionOptions } from "../../apis/Quiz/QuizApis";
import { getAllQuizQuestionsByQuizId, getQuizQuestionByQuizQuestionId } from "../../apis/QuizQuestion/QuizQuestionApis";
import { Button } from "../../values/ButtonElements";
import QuizQuestionComponent from "./components/QuizQuestionComponent"
import QuestionBankModal from "./components/QuestionBankModal"
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DeleteIcon from '@material-ui/icons/Delete';
import {
    Grid, TextField, IconButton
} from "@material-ui/core";
import { QuizContainer, QuizCard, QuizCardHeader, QuizCardContent, QuizQuestionCard } from "./QuizBuilderElements";
import { UpdateQuizReq } from '../../apis/Entities/Quiz';
import { QuizQuestionOption } from '../../apis/Entities/QuizQuestionOption';


function QuizBuilderPage(props: any) {

    const contentId = props.match.params.contentId;
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [quizQuestionArray, setQuizQuestionArray] = useState<QuizQuestion[]>([]);
    const [quiz, setQuiz] = useState<Quiz>();
    const [updatedQuiz, setUpdatedQuiz] = useState<Quiz>();
    const loggedInAccountId = window.sessionStorage.getItem("loggedInAccountId")


    useEffect(() => {
        getQuizByQuizId(contentId).then((res) => {
            setQuiz(res)
            setUpdatedQuiz(res)
            setName(res.name)
            setDescription(res.description)
        }).catch((err) => { console.log("error:getQuizByQuizId", err) });
        getAllQuizQuestionsByQuizId(contentId).then((res) => {
            setQuizQuestionArray(res)
        }).catch((err) => { console.log("error:getAllQuizQuestionsByQuizId", err) });
    }, [contentId])

    useEffect(() => {
        console.log("qn array updted", quizQuestionArray)
    }, [quizQuestionArray])

    const addNewQuestion = () => {
        if (quiz !== undefined) {
            const newQuizQuestion: QuizQuestion = {
                quizQuestionId: null,
                content: "",
                questionType: "MCQ",
                marks: 1,
                quiz: quiz,
                quizQuestionOptions: []
            }
            quizQuestionArray.push(newQuizQuestion);
        }
    }

    const deleteQuestion = (event: React.MouseEvent<unknown>, index: number) => {
        const updatedQuizQuestionArray = quizQuestionArray.filter((q, qId) => { return (qId !== index); })
        setQuizQuestionArray(updatedQuizQuestionArray);
    }

    const onDragEnd = () => {
        //update state
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setName(e.target.value);
        const newQuiz = Object.assign(updatedQuiz, { name: e.target.value });
        setUpdatedQuiz(newQuiz);
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        const newQuiz = Object.assign(updatedQuiz, { description: e.target.value });
        setUpdatedQuiz(newQuiz);
    }

    const handleSubmit = () => {
        if (quiz !== undefined) {
            const quizQuestionOptionLists = quizQuestionArray.map((question) => question.quizQuestionOptions)
            const updateQuizReq: UpdateQuizReq = {
                quiz: quiz,
                quizQuestions: quizQuestionArray,
                quizQuestionOptionLists
            }
            console.log("handle submit", updateQuizReq)
            updateQuizWithQuizQuestionsAndQuizQuestionOptions(updateQuizReq)
                .then((res) => { console.log("Success updating quiz", res); setQuiz(res);})
                .catch((err) => { console.log("error updating quiz", err) });
        }
        window.location.reload(false); 
    }

    const handleUpdateQuestion = (updatedQuizQuestion: QuizQuestion, index: number) => {
        const updatedQuizQuestionArray = quizQuestionArray.map((q, qId) => {
            return (
                qId === index ? updatedQuizQuestion : q
            );
        })
        setQuizQuestionArray(updatedQuizQuestionArray);

    }

    const handleQuizQuestionOptionUpdate = (updatedQuizQuestion: QuizQuestion, index: number) => {
        const updatedQuizQuestionArray = quizQuestionArray.map((q, qId) => {
            return (
                qId === index ? updatedQuizQuestion : q
            );
        });
        setQuizQuestionArray(updatedQuizQuestionArray);

    }

    const handleChangeFromQuestionBank = (questionBankQuestionIds: number[]) => {
        var listOfQuestionsFromQuestionBank: QuizQuestion[] = [];
        var i;
        for (i = 0; i < questionBankQuestionIds.length; i++) {
            getQuizQuestionByQuizQuestionId(questionBankQuestionIds[i]).then((res) => {
                console.log("Success in handleChangeFromQuestionBank", res);
                const newQuestionFromBank = Object.assign(res, {quizQuestionId: null});
                const newQuestionArray = quizQuestionArray.concat([newQuestionFromBank]);
                setQuizQuestionArray(newQuestionArray);
            }).catch((err) => { console.log("Error in handleChangeFromQuestionBank", err); })
        }
    }

    const mapQuestionArray = (questionArray: QuizQuestion[]) => {
        return (
            <div>
                {questionArray.map(function (q, qId) {
                    return (
                        <>
                            <QuizQuestionCard key={qId}>
                                <QuizQuestionComponent type="mcq" question={q} questionIndex={qId}
                                    onUpdateQuestion={handleUpdateQuestion} onUpdateQuizQuestionOptions={handleQuizQuestionOptionUpdate} />
                                <IconButton style={{ alignItems: "baseline" }} onClick={(event) => deleteQuestion(event, qId)}>
                                    <DeleteIcon />
                                </IconButton>
                            </QuizQuestionCard>
                        </>
                    );
                })}
            </div>
        );
    };


    return (
        <>
            <QuizContainer>
                <QuizCard>
                    <QuizCardHeader
                        title="Quiz Information"
                    />
                    <QuizCardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField required id="standard-basic" fullWidth value={name} label="Name" name="name" onChange={handleNameChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required id="standard-basic" fullWidth value={description} multiline maxRows={3} name="description"
                                    label="Description" onChange={handleDescriptionChange} />
                            </Grid>
                        </Grid>
                        <Button primary onClick={handleSubmit}>Save</Button>
                    </QuizCardContent>
                </QuizCard>

                <QuizCard>
                    <QuizCardHeader
                        title="Quiz Builder"
                        action={
                            <div style={{ display: "flex" }}>
                                <Button onClick={addNewQuestion}>Add New Question</Button>
                                <QuestionBankModal onChangeFromQuestionBank={handleChangeFromQuestionBank} />
                            </div>
                        }
                    />
                    <QuizCardContent>
                        {mapQuestionArray(quizQuestionArray)}
                        {/* <DragDropContext onDragEnd={onDragEnd}>
                            {columns.map(columnId => {
                                const column = columns[columnId];
                                return mapQuestionArray
                            })}
                        </DragDropContext> */}
                    </QuizCardContent>
                </QuizCard>
            </QuizContainer>
        </>
    )
}

export default QuizBuilderPage;
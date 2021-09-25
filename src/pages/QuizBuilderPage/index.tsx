import React, { useState, useEffect } from 'react';
import { Quiz } from './../../apis/Entities/Quiz';
import { QuizQuestion, QuestionType } from "../../apis/Entities/QuizQuestion";
import { getQuizByQuizId, updateQuizWithQuizQuestionsAndQuizQuestionOptions } from "../../apis/Quiz/QuizApis";
import { getAllQuizQuestionsByQuizId } from "../../apis/QuizQuestion/QuizQuestionApis";
import { Button } from "../../values/ButtonElements";
import QuizQuestionComponent from "./components/QuizQuestionComponent"
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DeleteIcon from '@material-ui/icons/Delete';
import {
    Grid, TextField, IconButton
} from "@material-ui/core";
import { QuizContainer, QuizCard, QuizCardHeader, QuizCardContent, QuizQuestionCard } from "./QuizBuilderElements";
import { UpdateQuizReq } from '../../apis/Entities/Quiz';

function QuizBuilderPage(props: any) {

    const contentId = props.match.params.contentId;
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [newQ, setNewQ] = useState<number[]>([]);
    const [quizQuestionArray, setQuizQuestionArray] = useState<QuizQuestion[]>([]);
    const [quiz, setQuiz] = useState<Quiz>();
    const [updatedQuiz, setUpdatedQuiz] = useState<Quiz>();

    useEffect(() => {
        getQuizByQuizId(contentId).then((res) => {
            setQuiz(res)
            setUpdatedQuiz(res)
            setName(res.name)
            setDescription(res.description)
        }).catch((err) => { console.log("error:getQuizByQuizId", err) });
        getAllQuizQuestionsByQuizId(contentId).then((res) => {
            console.log("quiz qn", res)
            setQuizQuestionArray(res)
        }).catch((err) => { console.log("error:getAllQuizQuestionsByQuizId", err) });
    }, [contentId])

    const addNewQuestion = () => {
        if (quiz != undefined) {
            const newQuizQuestion: QuizQuestion = {
                quizQuestionId: null,
                content: "",
                questionType: "MCQ",
                marks: 1,
                quiz: quiz,
                quizQuestionOptions: []
            }
            const newQuestionArray = quizQuestionArray.push(newQuizQuestion)
            console.log("newQuestionArray", newQuestionArray)
            // setQuizQuestionArray(newQuestionArray)
        }
    }

    const deleteQuestion = (event: React.MouseEvent<unknown>, qId: number) => {
        console.log("delet qn", qId)
        const newQs = newQ.splice(qId, 1)
        setNewQ(newQs)
    }

    const mapQuestionArray = (questionArray: QuizQuestion[]) => {
        return (
            <div>
                {questionArray.map(function (q, qId) {
                    return (
                        <>
                            <QuizQuestionCard key={qId}>
                                <QuizQuestionComponent type="mcq" question={q} updatedQuestion={handleUpdateQuestion}/>
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

    const onDragEnd = () => {
        //update state
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setName(e.target.value)
        const newQuiz = Object.assign(updatedQuiz, {name: e.target.value})
        console.log("handleNameChange", newQuiz)
        setUpdatedQuiz(newQuiz)
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDescription(e.target.value)
        const newQuiz = Object.assign(updatedQuiz, {description: e.target.value})
        console.log("handleDescriptionChange", newQuiz)
        setUpdatedQuiz(newQuiz)
    }

    const handleSubmit = () => {
        if (updatedQuiz != undefined) {
            const quizQuestionOptionLists = quizQuestionArray.map((question) => question.quizQuestionOptions)
            const updateQuizReq: UpdateQuizReq = {
                quiz: updatedQuiz,
                quizQuestions: quizQuestionArray,
                quizQuestionOptionLists
            }
            console.log("handleSubmit", updateQuizReq)
            updateQuizWithQuizQuestionsAndQuizQuestionOptions(updateQuizReq)
            .then((res) => { console.log("Success updating quiz", res) })
            .catch((err) => { console.log("error updating quiz", err) });
        }
    }

    const handleUpdateQuestion = () => {
        // handle update here (need seq, ques, options)
    }


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
                                <TextField required id="standard-basic" fullWidth value={description} multiline maxRows={3} name="description" label="Description" onChange={handleDescriptionChange} />
                            </Grid>
                        </Grid>
                        <Button primary onClick={handleSubmit}>Save</Button>
                    </QuizCardContent>
                </QuizCard>

                <QuizCard>
                    <QuizCardHeader
                        title="Quiz Builder"
                        action={
                            <Button onClick={addNewQuestion}>Add New Question</Button>
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
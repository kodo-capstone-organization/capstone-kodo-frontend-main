import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import {
    Chip,
    Grid, 
    TextField, 
    Input, 
    InputLabel
} from "@material-ui/core";

import { 
    DragDropContext, 
    Droppable, 
    Draggable 
} from 'react-beautiful-dnd';

import { Quiz } from './../../apis/Entities/Quiz';
import { QuizQuestion } from "../../apis/Entities/QuizQuestion";
import { UpdateQuizReq } from '../../apis/Entities/Quiz';

import { getAccountByQuizId } from "../../apis/Account/AccountApis";

import { 
    getQuizByQuizId, 
    updateQuizWithQuizQuestionsAndQuizQuestionOptions 
} from "../../apis/Quiz/QuizApis";
import { 
    getAllQuizQuestionsByQuizId, 
    getQuizQuestionByQuizQuestionId 
} from "../../apis/QuizQuestion/QuizQuestionApis";

import {
    QuizBuilderCardContent,
    QuizCard, 
    QuizCardContent,
    QuizCardHeader, 
    QuizContainer, 
    QuizQuestionCard, 
} from "./QuizBuilderElements";

import QuizQuestionComponent from "./components/QuizQuestionComponent"
import QuestionBankModal from "./components/QuestionBankModal"

import { Button } from "../../values/ButtonElements";


function QuizBuilderPage(props: any) {

    const contentId = props.match.params.contentId;
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [maxAttempts, setMaxAttempts] = useState<number>();
    const [timeLimitSeconds, setTimeLimitSeconds] = useState<string>("00");
    const [timeLimitHours, setTimeLimitHours] = useState<string>("00");
    const [timeLimitMinutes, setTimeLimitMinutes] = useState<string>("00");
    // const [quizQuestionArray, setQuizQuestionArray] = useState<QuizQuestion[]>([]); //updated at first render and question & option updates BEFORE DRAGGABLE
    const [quizQuestionArray, setQuizQuestionArray] = useState<any[]>([]); //updated at first render and question & option updates, incl draggableId
    const [quiz, setQuiz] = useState<Quiz>(); //only updated at first render & after submit
    const [updatedQuiz, setUpdatedQuiz] = useState<Quiz>(); // updated with every field change
    const loggedInAccountId = window.sessionStorage.getItem("loggedInAccountId");
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const history = useHistory();
    const [draggableId, setDraggableId] = useState<number>(0);


    useEffect(() => {
        getAccountByQuizId(contentId).then((res) => {
            if (loggedInAccountId && res.accountId !== parseInt(loggedInAccountId)) {
                history.push("/profile");
            }
        }).catch((err) => {
            console.log("Error: get account by quizId", err)
        });
      
        if (history.location.state)
        {
            history.location.state.mode === "VIEW" ? setIsDisabled(true) : setIsDisabled(false);
        }
      
        getQuizByQuizId(contentId).then((res) => {
            setQuiz(res);
            setUpdatedQuiz(res);
            setName(res.name);
            setDescription(res.description);
            setMaxAttempts(res.maxAttemptsPerStudent);
            setTimeLimitHours(`${res.timeLimit.charAt(0)}${res.timeLimit.charAt(1)}`);
            setTimeLimitMinutes(`${res.timeLimit.charAt(3)}${res.timeLimit.charAt(4)}`);
            setTimeLimitSeconds(`${res.timeLimit.charAt(6)}${res.timeLimit.charAt(7)}`);
        }).catch((err) => { console.log("error:getQuizByQuizId", err) });
        getAllQuizQuestionsByQuizId(contentId).then((res) => {
            let arrayWtihDraggableId: any = []
            var mapDraggable = 0;
            res.map((question) => {
                const withDraggableId = Object.assign(question, { draggableId: mapDraggable });
                arrayWtihDraggableId = arrayWtihDraggableId.concat([withDraggableId]);
                mapDraggable++;
            })
            setDraggableId(mapDraggable);
            setQuizQuestionArray(arrayWtihDraggableId);
            // setQuizQuestionArray(res)
        }).catch((err) => { console.log("error:getAllQuizQuestionsByQuizId", err) });
    }, [contentId])

    useEffect(() => {
        console.log("qn array updted", quizQuestionArray)
    }, [quizQuestionArray])

    const addNewQuestion = () => {
        if (quiz) {
            const newDraggableId = draggableId + 1;
            setDraggableId(newDraggableId);
            const newQuizQuestion: any = {
                quizQuestionId: null,
                content: "",
                questionType: "MCQ",
                marks: 1,
                quiz: quiz,
                quizQuestionOptions: [],
                draggableId: newDraggableId
            }
            quizQuestionArray.push(newQuizQuestion);
        }
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

    const handleTimeLimitHourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        var value: any = parseInt(e.target.value);
        if (value > 24) {
            value = "24";
        } else if (value < 0) {
            value = "00";
        } else if (value < 10) {
            value = `0${value}`
        }
        setTimeLimitHours(value);
        const timeLimit = `${value}:${timeLimitMinutes}:${timeLimitSeconds}`
        const newQuiz = Object.assign(updatedQuiz, { timeLimit });
        setUpdatedQuiz(newQuiz);
    }

    const handleTimeLimitMinutesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        var value: any = parseInt(e.target.value);

        if (value > 59) {
            value = "59";
        } else if (value < 0) {
            value = "00";
        } else if (value < 10) {
            value = `0${value}`
        }
        setTimeLimitMinutes(value);
        const timeLimit = `${timeLimitHours}:${value}:${timeLimitSeconds}`
        const newQuiz = Object.assign(updatedQuiz, { timeLimit });
        setUpdatedQuiz(newQuiz);
    }

    const handleTimeLimitSecondsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        var value: any = parseInt(e.target.value);

        if (value > 59) {
            value = "59";
        } else if (value < 0) {
            value = "00";
        } else if (value < 10) {
            value = `0${value}`
        }
        setTimeLimitSeconds(value);
        const timeLimit = `${timeLimitHours}:${timeLimitMinutes}:${value}`
        const newQuiz = Object.assign(updatedQuiz, { timeLimit });
        setUpdatedQuiz(newQuiz);
    }

    const handleAttemptChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        var value = parseInt(e.target.value);
        if (value > 100) {
            value = 100;
        } else if (value < 0) {
            value = 0;
        }
        setMaxAttempts(value);
        const newQuiz = Object.assign(updatedQuiz, { maxAttemptsPerStudent: value });
        setUpdatedQuiz(newQuiz);
    }

    const handleSubmit = () => {
        if (updatedQuiz !== undefined) {
            var quizQuestionOptionLists = quizQuestionArray;
            quizQuestionOptionLists = quizQuestionOptionLists.map((question) => question.quizQuestionOptions)
            var quizQuestions = quizQuestionArray;
            // remove draggableId for submit
            quizQuestions = quizQuestions.map((question) => question = {
                quizQuestionId: question.quizQuestionId,
                content: question.content,
                questionType: question.questionType,
                marks: question.marks,
                quiz: question.quiz,
                quizQuestionOptions: question.quizQuestionOptions
            })
            const updateQuizReq: UpdateQuizReq = {
                quiz: updatedQuiz,
                quizQuestions,
                quizQuestionOptionLists
            }
            console.log("check updateQuizReq", updateQuizReq);
            updateQuizWithQuizQuestionsAndQuizQuestionOptions(updateQuizReq)
                .then((res) => {
                    props.callOpenSnackBar("Successfully updated Quiz", "success")
                    setQuiz(res)
                })
                .catch((err) => {
                    props.callOpenSnackBar(`Error in updating Quiz: ${err}`, "error")
                });
        }
        window.location.reload();
    }

    const handleUpdateQuestion = (updatedQuizQuestion: QuizQuestion, index: number) => {
        var updatedQuizQuestionArray = [];
        if (updatedQuizQuestion === null) {
            // question deletion
            updatedQuizQuestionArray = quizQuestionArray.filter((q, qId) => q.draggableId !== parseInt(index));
        } else {
            // question update
            updatedQuizQuestionArray = quizQuestionArray.map((q, qId) => {
                return (
                    qId === index ? updatedQuizQuestion : q
                );
            });
        }
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
        var mapDraggable = draggableId + 1;
        questionBankQuestionIds.map((id) => {
            getQuizQuestionByQuizQuestionId(id).then((res) => {
                console.log("Success in handleChangeFromQuestionBank", res);
                const withDraggableId = Object.assign(res, { draggableId: mapDraggable });
                mapDraggable++;
                quizQuestionArray.push(withDraggableId);
            }).catch((err) => { console.log("Error in handleChangeFromQuestionBank", err); })
        })
        setDraggableId(mapDraggable);
    }

    const handleOnDragEnd = (result) => {
        //update state
        var items = quizQuestionArray;
        // console.log("items before", items);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items = items.splice(result.destination.index, 0, reorderedItem);
        // console.log("items after", items);
        // setQuizQuestionArray(items);
    }

    const mapQuestionArray = (questionArray: QuizQuestion[]) => {
        return (
            <div>
                {questionArray.length > 0 && questionArray.map(function (q, qId) {
                    return (
                        isDisabled ?
                            <QuizQuestionCard key={qId}>
                                <QuizQuestionComponent disabled={isDisabled} question={q} questionIndex={qId}
                                    onUpdateQuestion={handleUpdateQuestion} onUpdateQuizQuestionOptions={handleQuizQuestionOptionUpdate} />
                            </QuizQuestionCard>
                            :
                            <Draggable key={q.draggableId.toString()} draggableId={q.draggableId.toString()} index={qId}>
                                {(provided) => (
                                    <QuizQuestionCard ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        {/* {q.draggableId.toString()} */}
                                        <QuizQuestionComponent disabled={isDisabled} question={q} questionIndex={q.draggableId.toString()}
                                            onUpdateQuestion={handleUpdateQuestion} onUpdateQuizQuestionOptions={handleQuizQuestionOptionUpdate} />
                                    </QuizQuestionCard>
                                )}
                            </Draggable>
                        // <>
                        //     <QuizQuestionCard key={qId}>
                        //         <QuizQuestionComponent disabled={isDisabled} question={q} questionIndex={qId}
                        //             onUpdateQuestion={handleUpdateQuestion} onUpdateQuizQuestionOptions={handleQuizQuestionOptionUpdate} />
                        //     </QuizQuestionCard>
                        // </>
                    );
                })}
            </div>
        );
    };


    return (
        <>
            <QuizContainer>
                <QuizCard id="quiz-information-card">
                    <QuizCardHeader
                        title="Quiz Information"
                        action={
                            isDisabled ?
                                <Chip variant="outlined" size="small" label="View Mode" style={{ color: "blue", border: "1px solid blue" }} disabled /> :
                                <Button disabled={isDisabled} primary onClick={handleSubmit}>Save Quiz</Button>
                        }
                    />
                    <QuizCardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField disabled={isDisabled} required id="standard-basic" fullWidth value={name} label="Name" name="name" onChange={handleNameChange} />
                            </Grid>
                            <Grid item xs={4}>
                                <InputLabel htmlFor="quiz-timelimit">Time Limit Hours</InputLabel>
                                <Input
                                    disabled={isDisabled}
                                    fullWidth
                                    id="quiz-timelimit"
                                    placeholder="Hours"
                                    name="timelimit"
                                    type="number"
                                    autoFocus
                                    value={timeLimitHours}
                                    onChange={handleTimeLimitHourseChange}
                                    inputProps={{ min: 0, max: 23 }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <InputLabel htmlFor="quiz-timelimit">Time Limit Minutes</InputLabel>
                                <Input
                                    disabled={isDisabled}
                                    fullWidth
                                    id="quiz-timelimit"
                                    placeholder="Minutes"
                                    name="timelimit"
                                    type="number"
                                    autoFocus
                                    value={timeLimitMinutes}
                                    onChange={handleTimeLimitMinutesChange}
                                    inputProps={{ min: 0, max: 59 }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <InputLabel htmlFor="quiz-timelimit">Time Limit Seconds</InputLabel>
                                <Input
                                    disabled={isDisabled}
                                    fullWidth
                                    id="quiz-timelimit"
                                    placeholder="Seconds"
                                    name="timelimit"
                                    type="number"
                                    autoFocus
                                    value={timeLimitSeconds}
                                    onChange={handleTimeLimitSecondsChange}
                                    inputProps={{ min: 0, max: 59 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel htmlFor="quiz-maxattempts">Max Attempts*</InputLabel>
                                <Input
                                    disabled={isDisabled}
                                    id="quiz-maxattempts"
                                    type="number"
                                    autoFocus
                                    fullWidth
                                    value={maxAttempts}
                                    onChange={handleAttemptChange}
                                    inputProps={{ min: 0, max: 100 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField disabled={isDisabled} required id="standard-basic" fullWidth value={description} name="description"
                                    label="Description" onChange={handleDescriptionChange} />
                            </Grid>
                        </Grid>
                        {/* <Button disabled={isDisabled} primary={!isDisabled} onClick={handleSubmit}>Save</Button> */}
                    </QuizCardContent>
                </QuizCard>

                <QuizCard id="quiz-builder-card">
                    <QuizCardHeader
                        title="Quiz Builder"
                        action={
                            <div style={{ display: "flex" }}>
                                {
                                    isDisabled ? <Chip variant="outlined" size="small" label="View Mode" style={{ color: "blue", border: "1px solid blue" }} disabled /> :
                                        <>
                                            <QuestionBankModal disabled={isDisabled} onChangeFromQuestionBank={handleChangeFromQuestionBank} />
                                          &nbsp;&nbsp;
                                          <Button primary disabled={isDisabled} onClick={addNewQuestion}>Add New Question</Button>
                                        </>
                                }
                            </div>
                        }
                    />
                    <QuizBuilderCardContent>
                        {
                            isDisabled && mapQuestionArray(quizQuestionArray)
                        }
                        {
                            !isDisabled &&
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId="characters">
                                    {
                                        (provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {mapQuestionArray(quizQuestionArray)}
                                                {provided.placeholder}
                                            </div>
                                        )
                                    }
                                </Droppable>
                            </DragDropContext>
                        }

                        {/* {mapQuestionArray(quizQuestionArray)} */}
                    </QuizBuilderCardContent>
                </QuizCard>
            </QuizContainer>
        </>
    )
}

export default QuizBuilderPage;
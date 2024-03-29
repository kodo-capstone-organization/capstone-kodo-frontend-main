import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import {
    Breadcrumbs,
    Chip,
    Grid,
    Input,
    InputLabel,
    Link,
    TextField,
    Fab
} from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {
    DragDropContext,
    Droppable,
    Draggable
} from 'react-beautiful-dnd';

import { Course } from '../../entities/Course';
import { Quiz } from '../../entities/Quiz';
import { QuizQuestion } from "../../entities/QuizQuestion";
import { QuizQuestionOption } from "../../entities/QuizQuestionOption";
import { UpdateQuizReq } from '../../entities/Quiz';

import { getAccountByQuizId } from "../../apis/AccountApis";

import {
    getQuizByQuizIdAndAccountId,
    updateQuizWithQuizQuestionsAndQuizQuestionOptions,
} from "../../apis/QuizApis";
import {
    getAllQuizQuestionsByQuizId,
} from "../../apis/QuizQuestionApis";
import {
    getCourseByContentId
} from "../../apis/CourseApis";

import {
    QuizBuilderCardContent,
    QuizCard,
    QuizCardContent,
    QuizCardHeader,
    QuizContainer,
    QuizQuestionCard,
} from "./QuizBuilderElements";

import QuizQuestionComponent from "./components/QuizQuestionComponent";
import QuestionBankModal from "./components/QuestionBankModal";
import CreateQuestionModal from "./components/CreateQuestionModal";


import { Button } from "../../values/ButtonElements";


function QuizBuilderPage(props: any) {

    const contentId = props.match.params.contentId;
    const [courseId, setCourseId] = useState<number>(); // for backwards navigation to course builder
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [maxAttempts, setMaxAttempts] = useState<number>();
    const [timeLimitSeconds, setTimeLimitSeconds] = useState<string>("00");
    const [timeLimitHours, setTimeLimitHours] = useState<string>("00");
    const [timeLimitMinutes, setTimeLimitMinutes] = useState<string>("00");
    const [quizQuestionArray, setQuizQuestionArray] = useState<any[]>([]); //updated at first render and question & option updates, incl draggableId
    const [quiz, setQuiz] = useState<Quiz>(); //only updated at first render & after submit
    const [updatedQuiz, setUpdatedQuiz] = useState<Quiz>(); // updated with every field change
    const loggedInAccountId = window.sessionStorage.getItem("loggedInAccountId");
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const history = useHistory();
    const [draggableId, setDraggableId] = useState<number>(0);
    const [selectedFromQuestionBank, setSelectedFromQuestionBank] = useState<any>([]);


    useEffect(() => {
        getCourseByContentId(contentId).then((res: Course) => {
            setIsDisabled(res.isEnrollmentActive || res.isReviewRequested);
            setCourseId(res.courseId)
        }).catch(err => handleError(err));
        if (loggedInAccountId) {
            getQuizByQuizIdAndAccountId(contentId, parseInt(loggedInAccountId)).then((res) => {
                setQuiz(res);
                setUpdatedQuiz(res);
                setName(res.name);
                setDescription(res.description);
                setMaxAttempts(res.maxAttemptsPerStudent);
                setTimeLimitHours(`${res.timeLimit.charAt(0)}${res.timeLimit.charAt(1)}`);
                setTimeLimitMinutes(`${res.timeLimit.charAt(3)}${res.timeLimit.charAt(4)}`);
                // setTimeLimitSeconds(`${res.timeLimit.charAt(6)}${res.timeLimit.charAt(7)}`);
            }).catch(err => handleError(err));
        }
        getAllQuizQuestionsByQuizId(contentId).then((res) => {
            // populating questions with draggable id
            let arrayWtihDraggableId: any = []
            var mapDraggable = 0;
            res.map((question) => {
                const withDraggableId = Object.assign(question, { draggableId: mapDraggable });
                arrayWtihDraggableId = arrayWtihDraggableId.concat([withDraggableId]);
                mapDraggable++;
            })
            setDraggableId(mapDraggable);
            setQuizQuestionArray(arrayWtihDraggableId);
        }).catch((err) => {
            props.callOpenSnackBar(`Error in initialising Quiz: ${err}`, "error")
        });
    }, [contentId]);

    function handleError(err: any): void {
        const errorDataObj = createErrorDataObj(err);
        props.callOpenSnackBar("Error in retrieving quiz", "error");
        history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj } })
    }

    function createErrorDataObj(err: any): any {
        const errorDataObj = {
            message1: 'Unable to view quiz',
            message2: err.response.data.message,
            errorStatus: err.response.status,
            returnPath: '/progresspage',
            returnText: 'My Progress'
        }

        return errorDataObj;
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

    const handleTimeLimitHoursChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        var value: any = parseInt(e.target.value);
        var resetMinutes = timeLimitMinutes;
        if (value > 23) {
            value = "23";
        } else if (value <= 0) {
            value = "00";
            resetMinutes = "15";
        } else if (value < 10) {
            value = `0${value}`
        }
        setTimeLimitHours(value);
        setTimeLimitMinutes(resetMinutes);
        const timeLimit = `${value}:${resetMinutes}:${timeLimitSeconds}`
        const newQuiz = Object.assign(updatedQuiz, { timeLimit });
        setUpdatedQuiz(newQuiz);
    }

    const handleTimeLimitMinutesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        var value: any = parseInt(e.target.value);
        console.log(parseInt(timeLimitHours));
        if (parseInt(timeLimitHours) != 0) {
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
        } else {
            if (value > 59) {
                value = "59";
            } else if (value < 15) {
                value = "15";
            }
            setTimeLimitMinutes(value);
            const timeLimit = `${timeLimitHours}:${value}:${timeLimitSeconds}`
            const newQuiz = Object.assign(updatedQuiz, { timeLimit });
            setUpdatedQuiz(newQuiz);
        }
    }

    const handleMaxAttemptChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        var value = parseInt(e.target.value);
        if (value > 100) {
            value = 100;
        } else if (value < 1) {
            value = 1;
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
            updateQuizWithQuizQuestionsAndQuizQuestionOptions(updateQuizReq)
                .then((res) => {
                    props.callOpenSnackBar("Successfully updated Quiz", "success")
                    setQuiz(res)
                })
                .catch((err) => {
                    props.callOpenSnackBar(`Error in updating Quiz: ${err?.response.data.message}`, "error")
                });
        }
    }

    const handleUpdateQuestion = (updatedQuizQuestion: QuizQuestion, index: number) => {
        var updatedQuizQuestionArray = [];
        if (updatedQuizQuestion === null) {
            // question deletion
            console.log("qn deletion")
            updatedQuizQuestionArray = quizQuestionArray.filter((q, qId) => q.draggableId !== index);
        } else {
            // question update
            console.log("qn update")
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

    const handleChangeFromQuestionBank = (questionBankQuestions: any[]) => {
        let arrayWtihDraggableId: any = quizQuestionArray;
        var mapDraggable = draggableId + 1;
        questionBankQuestions.map((question) => {
            const withDraggableId = Object.assign(question, { draggableId: mapDraggable });
            arrayWtihDraggableId = arrayWtihDraggableId.concat([withDraggableId]);
            mapDraggable++;
        })
        setDraggableId(mapDraggable);
        setSelectedFromQuestionBank(questionBankQuestions);
        setQuizQuestionArray(arrayWtihDraggableId);
    }

    const handleAddNewQuestion = (newQuizQuestion: QuizQuestion) => {
        if (quiz) {
            const newDraggableId = draggableId + 1;
            setDraggableId(newDraggableId);
            newQuizQuestion = Object.assign(newQuizQuestion, { draggableId: newDraggableId, quiz });
            quizQuestionArray.push(newQuizQuestion);
            props.callOpenSnackBar(`Added new ${newQuizQuestion.questionType} question.`, "success")
        }
    }

    const handleOnDragEnd = (result: any) => {
        //updating draggable state
        var items = quizQuestionArray;
        const [reorderedItem] = items.splice(result.source.index, 1);
        items = items.splice(result.destination.index, 0, reorderedItem);
        // setQuizQuestionArray(items);
    }

    const handleCallSnackbar = (msg: string) => {
        props.callOpenSnackBar(`Error in updating Quiz: ${msg}`, "error")
    }

    const mapQuestionArray = (questionArray: any[]) => {
        return (
            <div>
                {questionArray.map(function (q, qId) {
                    return (
                        isDisabled ?
                            // un-draggable
                            <QuizQuestionCard key={qId}>
                                <QuizQuestionComponent disabled={isDisabled} question={q} questionIndex={qId}
                                    onUpdateQuestion={handleUpdateQuestion} onUpdateQuizQuestionOptions={handleQuizQuestionOptionUpdate} />
                            </QuizQuestionCard>
                            :
                            // draggable
                            <Draggable key={q.draggableId.toString()} draggableId={q.draggableId.toString()} index={qId}>
                                {(provided) => (
                                    <QuizQuestionCard ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <QuizQuestionComponent disabled={isDisabled} question={q} questionIndex={q.draggableId}
                                            onUpdateQuestion={handleUpdateQuestion} onUpdateQuizQuestionOptions={handleQuizQuestionOptionUpdate}
                                            onCallSnackbar={handleCallSnackbar}
                                        />
                                    </QuizQuestionCard>
                                )}
                            </Draggable>
                    );
                })}
            </div>
        );
    };


    return (
        <>
            <QuizContainer>
                <Breadcrumbs aria-label="quizbuilder-breadcrumb" style={{ marginBottom: "1rem" }}>
                    <Link color="primary" href={`/builder/${courseId}`}>
                        <ArrowBackIcon style={{ verticalAlign: "middle" }} />&nbsp;
                        <span style={{ verticalAlign: "bottom" }}>Back To Coursebuilder</span>
                    </Link>
                </Breadcrumbs>

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
                            <Grid item xs={6}>
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
                                    onChange={handleTimeLimitHoursChange}
                                    inputProps={{ min: 0, max: 23 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
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
                            <Grid item xs={12}>
                                <InputLabel htmlFor="quiz-maxattempts">Max Attempts*</InputLabel>
                                <Input
                                    disabled={isDisabled}
                                    id="quiz-maxattempts"
                                    type="number"
                                    autoFocus
                                    fullWidth
                                    value={maxAttempts}
                                    onChange={handleMaxAttemptChange}
                                    inputProps={{ min: 1, max: 100 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField disabled={isDisabled} required id="standard-basic" fullWidth value={description} name="description"
                                    label="Description" onChange={handleDescriptionChange} />
                            </Grid>
                        </Grid>
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
                                            <QuestionBankModal selectedFromQuestionBank={selectedFromQuestionBank} disabled={isDisabled} onChangeFromQuestionBank={handleChangeFromQuestionBank} />
                                            &nbsp;&nbsp;
                                            <CreateQuestionModal disabled={isDisabled} onAddNewQuestion={handleAddNewQuestion} />
                                        </>
                                }
                            </div>
                        }
                    />
                    <QuizBuilderCardContent>
                        {
                            // printing non-draggable array
                            isDisabled &&
                            mapQuestionArray(quizQuestionArray)
                        }
                        {
                            // printing draggable array
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

                    </QuizBuilderCardContent>
                </QuizCard>
            </QuizContainer>
            {/* <Fab variant="extended">
                Save Quiz
            </Fab> */}
        </>
    )
}

export default QuizBuilderPage;
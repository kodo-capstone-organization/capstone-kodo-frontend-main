import { useEffect, useState } from 'react';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";
import {
    AddQuestionByTypeButton
} from "../QuizBuilderElements";

import { QuizQuestion } from '../../../apis/Entities/QuizQuestion';
import { QuizQuestionOption } from "../../../apis/Entities/QuizQuestionOption";

import { getAllQuizQuestionsByTutorId } from "../../../apis/QuizQuestion/QuizQuestionApis";

import { Button } from "../../../values/ButtonElements";


function CreateQuestionModal(props: any) {

    const [open, setOpen] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const accountId = window.sessionStorage.getItem("loggedInAccountId");

    useEffect(() => {
        setIsDisabled(props.disabled);
    }, [props.disabled])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addNewQuestion = (questionType: string) => {
        var newQuizQuestion: any;
        if (questionType === "MCQ") {
            const newQuizQuestionOption: QuizQuestionOption = {
                quizQuestionOptionId: null,
                leftContent: "MCQ OPTION",
                rightContent: null,
                correct: true
            };
            const defaultOptionTwo: QuizQuestionOption = {
                quizQuestionOptionId: null,
                leftContent: "MCQ OPTION",
                rightContent: null,
                correct: false
            };
            const defaultOptionThree: QuizQuestionOption = {
                quizQuestionOptionId: null,
                leftContent: "MCQ OPTION",
                rightContent: null,
                correct: false
            };
            newQuizQuestion = {
                quizQuestionId: null,
                content: "",
                questionType: "MCQ",
                marks: 1,
                quizQuestionOptions: [newQuizQuestionOption, defaultOptionTwo, defaultOptionThree],
            };
        }else if (questionType === "TF"){
            const newQuizQuestionOption: QuizQuestionOption = {
                quizQuestionOptionId: null,
                leftContent: "True",
                rightContent: null,
                correct: true
            };
            const defaultOptionTwo: QuizQuestionOption = {
                quizQuestionOptionId: null,
                leftContent: "False",
                rightContent: null,
                correct: false
            };
            newQuizQuestion = {
                quizQuestionId: null,
                content: "",
                questionType: "TF",
                marks: 1,
                quizQuestionOptions: [newQuizQuestionOption, defaultOptionTwo],
            };
        }else if (questionType === "MATCHING"){
            const newQuizQuestionOption: QuizQuestionOption = {
                quizQuestionOptionId: null,
                leftContent: "MATCHING LEFT OPTION",
                rightContent: "MATCHING RIGHT OPTION",
                correct: true
            };
            const defaultOptionTwo: QuizQuestionOption = {
                quizQuestionOptionId: null,
                leftContent: "MATCHING LEFTT OPTION",
                rightContent: "MATCHING RIGHT OPTION",
                correct: false
            };
            const defaultOptionThree: QuizQuestionOption = {
                quizQuestionOptionId: null,
                leftContent: "MATCHING LEFTT OPTION",
                rightContent: "MATCHING RIGHT OPTION",
                correct: false
            };
            newQuizQuestion = {
                quizQuestionId: null,
                content: "",
                questionType: "MATCHING",
                marks: 1,
                quizQuestionOptions: [newQuizQuestionOption, defaultOptionTwo, defaultOptionThree],
            };
        }
        props.onAddNewQuestion(newQuizQuestion);
        setOpen(false);
    }


    return (
        <>
            <div>
                <Button primary disabled={isDisabled} onClick={handleOpen}>
                    Add New Question
                </Button>
                <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
                    <DialogTitle>Add New Question</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Choose one of the below question types to create a new question!
                        </DialogContentText>
                        <div style={{ height: 200, width: '1000px', display: "flex" }}>
                            <AddQuestionByTypeButton onClick={()=>addNewQuestion("MCQ")}>MCQ</AddQuestionByTypeButton>
                            <AddQuestionByTypeButton onClick={()=>addNewQuestion("TF")}>True/False</AddQuestionByTypeButton>
                            <AddQuestionByTypeButton onClick={()=>addNewQuestion("MATCHING")}>MATCHING</AddQuestionByTypeButton>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
}

export default CreateQuestionModal;
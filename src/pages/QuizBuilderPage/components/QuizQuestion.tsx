import React, { useState, useEffect } from 'react';
import { Quiz } from '../../../apis/Entities/Quiz';
// import { getMyAccount } from "../../apis/Account/AccountApis";

import {
    CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, TextField, Typography, Divider
} from "@material-ui/core";
import { QuizContainer, QuizCard, QuizCardHeader, QuizCardContent, QuizQuestionCard } from "./../QuizBuilderElements";

function QuizQuestion(props: any) {

    const [quiz, setQuiz] = useState<Quiz>();
    // const [contentId, setContentId] = props.match.params.contentId;
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");


    useEffect(() => {
    }, [])


    return (
        <>

            <QuizQuestionCard>
                Question Type
                <Divider />
                Question
                <Divider />
                Options
                <Divider />
            </QuizQuestionCard>

        </>
    )
}

export default QuizQuestion;
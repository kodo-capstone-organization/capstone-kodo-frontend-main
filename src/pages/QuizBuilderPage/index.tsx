import React, { useState, useEffect } from 'react';
import { Quiz } from './../../apis/Entities/Quiz';
import { getQuizByQuizId } from "../../apis/Quiz/QuizApis";
import { Button } from "../../values/ButtonElements";
import  QuizQuestion  from "./components/QuizQuestion"
import {
    CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, TextField, Typography, Divider
} from "@material-ui/core";
import { QuizContainer, QuizCard, QuizCardHeader, QuizCardContent, QuizQuestionCard } from "./QuizBuilderElements";

function QuizBuilderPage(props: any) {

    const [quiz, setQuiz] = useState<Quiz>();
    const [contentId, setContentId] = props.match.params.contentId;
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");


    useEffect(() => {
        getQuizByQuizId(contentId).then((res) => {
            setName(res.name)
            setDescription(res.description)
        }).catch((err) => { console.log("error:getQuizByQuizId", err) });

    }, [contentId])


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
                                <TextField required id="standard-basic" fullWidth value={name} label="Name" name="name" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required id="standard-basic" fullWidth value={description} multiline maxRows={3} name="description" label="Description" />
                            </Grid>
                        </Grid>
                        <Button primary>Save</Button>
                    </QuizCardContent>
                </QuizCard>

                <QuizCard>
                    <QuizCardHeader
                        title="Quiz Builder"
                    />
                    <QuizCardContent>
                        <QuizQuestion/>
                    </QuizCardContent>
                </QuizCard>
            </QuizContainer>
        </>
    )
}

export default QuizBuilderPage;
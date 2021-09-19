import React, { useState, useEffect } from 'react';
import { Quiz } from './../../apis/Entities/Quiz';
// import { QuizQuestion } from "./../../apis/Entities/QuizQuestion";
import { getQuizByQuizId } from "../../apis/Quiz/QuizApis";
import { Button } from "../../values/ButtonElements";
import QuizQuestionComponent from "./components/QuizQuestionComponent"
import {
    Grid, TextField
} from "@material-ui/core";
import { QuizContainer, QuizCard, QuizCardHeader, QuizCardContent, QuizQuestionCard } from "./QuizBuilderElements";

function QuizBuilderPage(props: any) {

    const [quiz, setQuiz] = useState<Quiz>();
    const [contentId, setContentId] = props.match.params.contentId;
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [newQ, setNewQ] = useState([]);


    useEffect(() => {
        getQuizByQuizId(contentId).then((res) => {
            setName(res.name)
            setDescription(res.description)
            console.log("res", res)
        }).catch((err) => { console.log("error:getQuizByQuizId", err) });

    }, [contentId])

    const addNewQ = () => {
        // const add = newQ.push(new QuizQuestion())
        // setNewQ(add);
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
                        action={
                            <Button onClick={addNewQ}>Add New Question</Button>
                        }
                    />
                    <QuizCardContent>
                        {
                            newQ.map(q => {
                                <QuizQuestionComponent />
                            })
                        }
                    </QuizCardContent>
                </QuizCard>
            </QuizContainer>
        </>
    )
}

export default QuizBuilderPage;
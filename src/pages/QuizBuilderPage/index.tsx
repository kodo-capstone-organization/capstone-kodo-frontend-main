import React, { useState, useEffect } from 'react';
import { Quiz } from './../../apis/Entities/Quiz';
import { QuizQuestion } from "../../apis/Entities/QuizQuestion";
import { getQuizByQuizId } from "../../apis/Quiz/QuizApis";
import { Button } from "../../values/ButtonElements";
import QuizQuestionComponent from "./components/QuizQuestionComponent"
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DeleteIcon from '@material-ui/icons/Delete';
import {
    Grid, TextField, IconButton
} from "@material-ui/core";
import { QuizContainer, QuizCard, QuizCardHeader, QuizCardContent, QuizQuestionCard } from "./QuizBuilderElements";

function QuizBuilderPage(props: any) {

    const [contentId, setContentId] = props.match.params.contentId;
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [newQ, setNewQ] = useState<number[]>([1]);


    useEffect(() => {
        getQuizByQuizId(contentId).then((res) => {
            setName(res.name)
            setDescription(res.description)
            console.log("res", res)
        }).catch((err) => { console.log("error:getQuizByQuizId", err) });

    }, [contentId])


    const addNewQ = () => {
        const add = newQ.concat([1])
        setNewQ(add);
        console.log("addNewQ")
    }

    const deleteQuestion = (event: React.MouseEvent<unknown>, qId: number) => {
        console.log("delet qn", qId)
        const newQs = newQ.splice(qId,1)
        setNewQ(newQs)
    }

    const mapNewQ = (newQ: number[]) => {
        console.log("mapNewQ", newQ)
        return (
            <div>
                {newQ.map(function (q, qId) {
                    return (
                        <>
                            <QuizQuestionCard key={qId}>
                                <QuizQuestionComponent type="mcq"/>
                                <IconButton style={{alignItems:"baseline"}}>
                                    <DeleteIcon onClick={(event)=>deleteQuestion(event, qId)}/>
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
                        {mapNewQ(newQ)}
                        {/* <DragDropContext onDragEnd={onDragEnd}>
                            {columns.map(columnId => {
                                const column = columns[columnId];
                                return mapNewQ
                            })}
                        </DragDropContext> */}
                    </QuizCardContent>
                </QuizCard>
            </QuizContainer>
        </>
    )
}

export default QuizBuilderPage;
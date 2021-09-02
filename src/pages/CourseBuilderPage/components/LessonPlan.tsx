import React, { useState } from 'react';
import { Lesson } from './Lesson';
import { Grid, IconButton, TextField, Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { CourseBuilderCardHeader, CourseBuilderContent } from "./../CourseBuilderElements";

function LessonPlan() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [lessonId, setLessonId] = useState<number>(1);

    function addToLessons() {
        lessons.push({ id: lessonId });
        setLessons(lessons)
        setLessonId(lessonId + 1)
    }

    console.log(lessons)
    
    return (
        <>
        <CourseBuilderCardHeader
                    title="Lesson Plan"
                    action={
                        <IconButton color="primary" onClick={addToLessons}>
                            <AddIcon/>&nbsp; Add Lesson
                        </IconButton>
                    }/>
        {lessons.map((lesson) => {
            return (
                <CourseBuilderContent key={lesson.id}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField id="standard-basic" fullWidth required label="Name" value={lesson.name} onChange={e => {
                                const newLessons: Lesson[] = lessons.map(currentLesson => {
                                if (lesson.id === currentLesson.id) {
                                    currentLesson.name = e.target.value
                                }
                                return currentLesson;
                            });
                            setLessons(newLessons)
                            }}/>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField id="standard-basic" fullWidth multiline maxRows={3} required label="Quiz"/>
                        </Grid>
                        <Grid item xs={3}>
                        <Button
                                variant="contained"
                                component="label"
                                >
                                Build Quiz
                            </Button>
                        </Grid>
                    </Grid>
                </CourseBuilderContent>
        )})}
        </>
    )
}

export default LessonPlan;
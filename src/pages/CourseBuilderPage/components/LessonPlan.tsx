import React, { useState } from 'react';
import { Lesson } from './Lesson';
import { Grid, IconButton, TextField, Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { CourseBuilderCardHeader, CourseBuilderContent } from "./../CourseBuilderElements";
import ChipInput from 'material-ui-chip-input'

function LessonPlan() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [lessonId, setLessonId] = useState<number>(1);
    
    function addToLessons() {
        lessons.push({ lessonId: lessonId });
        setLessons(lessons)
        setLessonId(lessonId + 1)
    }

    const updateFiles = (lessonId: number, files: FileList) => {
        lessons.map((lesson) => {
            if (lesson.id === lessonId) {
                // @ts-ignore
                lesson.relatedFiles.push(files[0])
            }
            return lesson
        })
        setLessons([...lessons])
    }

    const deleteFile = (lessonId: number, fileToRemove: string) => {
        lessons.map((lesson) => {
            if (lesson.lessonId === lessonId) {
                // TODO: Fix to get lesson.multimedias...
                // lesson.relatedFiles = lesson.relatedFiles.filter((file) => file.name !== fileToRemove)
            }
            return lesson
        })
        setLessons([...lessons])
    }

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
                                if (lesson.lessonId === currentLesson.lessonId) {
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
                        <Grid item xs={9}>
                            <ChipInput fullWidth label="Related Files" value={lesson.relatedFiles.map((file) => file.name)} onDelete={(chip) => deleteFile(lesson.id, chip)}/>
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                variant="contained"
                                component="label"
                                >
                                Upload Files
                                <input
                                    type="file"
                                    hidden
                                    onChange={e => {
                                        if (e.target.files) updateFiles(lesson.id, e.target.files)
                                    }}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id="standard-basic" fullWidth multiline maxRows={3} required label="Quiz"/>
                        </Grid>
                    </Grid>
                </CourseBuilderContent>
        )})}
        </>
    )
}

export default LessonPlan;
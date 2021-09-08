import React, { useState } from 'react';
import { Lesson } from './../../../apis/Entities/Lesson';
import { AppBar, Tabs, Tab, Grid, IconButton, TextField, Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { CourseBuilderCardHeader, CourseBuilderContent } from "./../CourseBuilderElements";
import { tabProps, TabPanel }from './TabPanel';
import QuizTable from './QuizTable';
import MultimediaTable from './MultimediaTable';

function LessonPlan(props: any) {
    const handleFormDataChange = props.handleFormDataChange;
    const [lessons, setLessons] = useState<Lesson[]>(props.lessons);
    const [lessonId, setLessonId] = useState<number>(1);
    const [tabValue, setTabValue] = useState<number>(1);

    const addToLessons = () => {
        // @ts-ignore
        lessons.push({ lessonId: lessonId });
        setLessons(lessons)
        setLessonId(lessonId + 1)
    }

    const updateFiles = (lessonId: number, files: FileList) => {
        lessons.map((lesson) => {
            if (lesson.lessonId === lessonId) {
                // TODO: Fix to get lesson.multimedias... instead
                // lesson.relatedFiles.push(files[0])
            }
            return lesson
        })
        setLessons([...lessons])
    }

    const deleteFile = (lessonId: number, fileToRemove: string) => {
        lessons.map((lesson) => {
            if (lesson.lessonId === lessonId) {
                // TODO: Fix to get lesson.multimedias... instead
                // lesson.relatedFiles = lesson.relatedFiles.filter((file) => file.name !== fileToRemove)
            }
            return lesson
        })
        setLessons([...lessons])
    }

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    }

    const handleDeleteLesson = (lessonIdToDelete: number) => {
        const updatedLessons = lessons.filter((lesson: Lesson) => lesson.lessonId !== lessonIdToDelete)
        setLessons(updatedLessons)
        let wrapperEvent = {
            target: {
                name: "lessons",
                value: updatedLessons
            }
        }
        handleFormDataChange(wrapperEvent)
    }

    const handleLessonNameChange = (event: any) => {
        const updatedLessons = lessons.map((lesson: Lesson) => {
            if (lesson.lessonId.toString() === event.target.id) {
                lesson.name = event.target.value
            }
            return lesson
        })

        let wrapperEvent = {
            target: {
                name: "lessons",
                value: updatedLessons
            }
        }
        handleFormDataChange(wrapperEvent)
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
        <AppBar position="static" color="default">
            <Tabs value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example">
                    {lessons?.map((lesson, index) => {
                        return (<Tab label={"Lesson " + index} {...tabProps(index)}/>)
                    })} 
            </Tabs>
        </AppBar>
        {lessons?.map((lesson, index) => {
            return (
                <TabPanel value={tabValue} index={index}>
                    <CourseBuilderContent key={lesson.lessonId}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField id={lesson.lessonId.toString()} fullWidth required label="Name" value={lesson.name} onChange={handleLessonNameChange}/>
                            </Grid>
                            <Grid item xs={12}>
                                <QuizTable quizzes={lesson.quizzes}/>
                            </Grid>
                            <Grid item xs={12}>
                                <MultimediaTable multimedias={lesson.multimedias}/>
                            </Grid>
                            <Grid container xs={12} justify="flex-end">
                                <Button variant="contained"
                                    component="label"
                                    onClick={() => handleDeleteLesson(lesson.lessonId)}>
                                        Delete Lesson
                                </Button>
                            </Grid>
                            {/* <Grid item xs={9}>
                                <ChipInput fullWidth label="Multimedias" value={lesson.multimedias?.map((multimedia) => multimedia.name)} onDelete={(chip) => deleteFile(lesson.lessonId, chip)}/>
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
                                            if (e.target.files) updateFiles(lesson.lessonId, e.target.files)
                                        }}
                                    />
                                </Button>
                            </Grid> */}
                        </Grid>
                    </CourseBuilderContent>
                </TabPanel>
        )})}
        </>
    )
}

export default LessonPlan;
import React, { useState } from 'react';
import { Lesson } from './../../../apis/Entities/Lesson';
import { AppBar, Tabs, Tab, Grid, IconButton, TextField, Typography } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { CourseBuilderCardHeader, CourseBuilderContent } from "./../CourseBuilderElements";
import { tabProps, TabPanel }from './TabPanel';
import QuizTable from './QuizTable';
import MultimediaTable from './MultimediaTable';
import { Button } from "../../../values/ButtonElements";
import { BlankStateContainer } from '../../MyProfilePage/ProfileElements';

function LessonPlan(props: any) {
    const handleFormDataChange = props.handleFormDataChange;
    const [lessons, setLessons] = useState<Lesson[]>(props.lessons);
    const [tabValue, setTabValue] = useState<number>(0);

    const addToLessons = () => {
        // @ts-ignore
        const updatedLessons = lessons.concat({ multimedias: [], quizzes: [] });
        setLessons(updatedLessons)
    }

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    }

    const handleDeleteLesson = (lessonIdxToDelete: number) => {
        const updatedLessons = lessons.filter((lesson: Lesson, index: number) => index !== lessonIdxToDelete)
        let wrapperEvent = {
            target: {
                name: "lessons",
                value: updatedLessons
            }
        }
        handleFormDataChange(wrapperEvent)
        setLessons(updatedLessons)
    }

    const handleLessonNameChange = (event: any) => {
        const updatedLessons = lessons.map((lesson: Lesson, index: number) => {
            if (index.toString() === event.target.id) {
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

    const handleLessonDescriptionChange = (event: any) => {
        const updatedLessons = lessons.map((lesson: Lesson, index: number) => {
            if (index.toString() === event.target.id) {
                lesson.description = event.target.value
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
            {lessons.length === 0 &&
                <BlankStateContainer style={{ padding: "2rem"}}>
                    <Typography variant="h5">Begin building your course by adding one or more lessons! 🤓</Typography>
                    <br/>
                    <Button style={{width: "10%" }} onClick={addToLessons} big>Add Lesson</Button>
                </BlankStateContainer>
            }
            {lessons.length > 0 &&
                <>
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
                    { lessons?.map((lesson, index) => {
                        return (
                            <TabPanel value={tabValue} index={index}>
                                <CourseBuilderContent key={index}>
                                    <Grid container spacing={3}>
                                        <Grid style={{ padding: "0!important"}} item xs={12}>
                                            <TextField fullWidth required
                                                       id={index.toString()}
                                                       label="Name"
                                                       value={lesson.name}
                                                       onChange={handleLessonNameChange}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <QuizTable
                                                handleFormDataChange={handleFormDataChange}
                                                lessonIndex={index}
                                                quizzes={lesson.quizzes}
                                                lessons={lessons}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <MultimediaTable
                                                handleFormDataChange={handleFormDataChange}
                                                lessonIndex={index}
                                                multimedias={lesson.multimedias}
                                                lessons={lessons}
                                            />
                                        </Grid>
                                        <Grid container xs={12} justify="flex-end">
                                            <Button onClick={() => handleDeleteLesson(index)}>
                                                Delete Lesson
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CourseBuilderContent>
                            </TabPanel>
                        )}
                    )}
                </>
            }
        </>
    )
}

export default LessonPlan;
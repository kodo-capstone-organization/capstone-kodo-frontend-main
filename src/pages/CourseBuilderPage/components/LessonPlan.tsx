import React, { useState } from 'react';
import { Lesson } from './../../../apis/Entities/Lesson';
import { Dialog, DialogContent, DialogContentText, DialogTitle, InputLabel, Input, FormControl, DialogActions, AppBar, Tabs, Tab, Grid, IconButton, TextField, Typography } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { CourseBuilderCardHeader, CourseBuilderContent } from "./../CourseBuilderElements";
import { tabProps, TabPanel }from './TabPanel';
import QuizTable from './QuizTable';
import MultimediaTable from './MultimediaTable';
import { Button } from "../../../values/ButtonElements";
import { BlankStateContainer } from '../../MyProfilePage/ProfileElements';
import { createNewLesson, deleteLesson } from '../../../apis/Lesson/LessonApis';

interface IErrors<TValue> {
    [id: string]: TValue;
  }

function LessonPlan(props: any) {
    const handleFormDataChange = props.handleFormDataChange;
    const [lessons, setLessons] = useState<Lesson[]>(props.lessons);
    const [tabValue, setTabValue] = useState<number>(0);
    const [newLessonName, setNewLessonName] = useState<string>("");
    const [newLessonDescription, setNewLessonDescription] = useState<string>("");

    const [showAddLessonDialog, setShowAddLessonDialog] = useState<boolean>(false); 

    var [errors, setErrors] = useState<IErrors<boolean>>({
        name: false,
        description: false,
    });

    const openDialog = () => {
        setShowAddLessonDialog(true);
    }
  
    const handleClose = () => {
        setShowAddLessonDialog(false);
    }

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    }

    const handleDeleteLesson = (lessonId: number) => {
        deleteLesson(lessonId).then((result) => {
            if (result) {
                const updatedLessons = lessons.filter((lesson: Lesson) => lesson.lessonId !== lessonId)
                let wrapperEvent = {
                    target: {
                        name: "lessons",
                        value: updatedLessons
                    }
                }
                handleFormDataChange(wrapperEvent)
                setLessons(updatedLessons)
            }
        }) 
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

    const handleValidation = () => {
        let formIsValid = true;
        errors = {};
    
        if (newLessonName === "") {
          formIsValid = false ;
          errors['name'] = true;
        }
    
        if (newLessonDescription === "") {
          formIsValid = false;
          errors['description'] = true;      
        }
    
        setErrors(errors);
    
        return formIsValid;
      }
    
    const handleClickCreateLesson = () => {
        if (!handleValidation()) return

        createNewLesson(props.courseId, newLessonName, newLessonDescription, lessons.length + 1).then((newLesson) => {
            console.log(newLesson)

            const updatedLessons = lessons.concat(newLesson)
            let wrapperEvent = {
                target: {
                    name: "lessons",
                    value: updatedLessons
                }
            }
            handleFormDataChange(wrapperEvent)
            setLessons(updatedLessons)

            // Clean up modal
            handleClose()
            setNewLessonName("")
            setNewLessonDescription("")
        })
    }

    return (
        <>
        <Dialog 
        fullWidth
        open={showAddLessonDialog}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
            <DialogTitle>Add a new Lesson</DialogTitle>
            <DialogContent
              style={{height: '300px'}}>
              <DialogContentText>
                First, enter some basic details about the new lesson below.
              </DialogContentText>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="lesson-name">Lesson Name</InputLabel>
                <Input
                  error={errors['name']}
                  id="lesson-name"
                  name="name"
                  type="text"
                  autoFocus
                  fullWidth
                  value={newLessonName}
                  onChange={(e) => setNewLessonName(e.target.value)}
                />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="lesson-description">Description</InputLabel>
                  <Input
                    error={errors['description']}
                    id="lesson-description"
                    name="description"
                    type="text"
                    autoFocus
                    fullWidth
                    value={newLessonDescription}
                    onChange={(e) => setNewLessonDescription(e.target.value)}
                  />
                </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleClickCreateLesson}>
                Create Lesson
              </Button>
            </DialogActions>
    </Dialog>
        <CourseBuilderCardHeader
            title="Lesson Plan"
            action={
                <IconButton color="primary" onClick={openDialog}>
                    <AddIcon/>&nbsp; Add Lesson
                </IconButton>
            }/>
            {lessons.length === 0 &&
                <BlankStateContainer style={{ padding: "2rem"}}>
                    <Typography variant="h5">Begin building your course by adding one or more lessons! 🤓</Typography>
                    <br/>
                    <Button style={{width: "10%" }} onClick={openDialog} big>Add Lesson</Button>
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
                                const weekNumber = index + 1
                                return (<Tab key={index} label={"Week " + weekNumber} {...tabProps(index)}/>)
                            })}
                        </Tabs>
                    </AppBar>
                    { lessons?.map((lesson, index) => {
                        return (
                            <TabPanel value={tabValue} index={index} key={index}>
                                <CourseBuilderContent key={index}>
                                    <Grid container spacing={3}>
                                        <Grid style={{ padding: "0!important"}} item xs={12}>
                                            <TextField fullWidth required
                                                       id={index.toString()}
                                                       label="Name"
                                                       value={lesson.name}
                                                       onChange={handleLessonNameChange}/>
                                        </Grid>
                                        <Grid style={{ padding: "0!important"}} item xs={12}>
                                            <TextField fullWidth required
                                                       id={index.toString()}
                                                       label="Description"
                                                       value={lesson.description}
                                                       onChange={handleLessonDescriptionChange}/>
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
                                        <Grid container justifyContent="flex-end">
                                            <Button onClick={() => handleDeleteLesson(lesson.lessonId)}>
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
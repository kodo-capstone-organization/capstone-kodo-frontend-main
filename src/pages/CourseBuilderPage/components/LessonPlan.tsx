import React, { useState } from 'react';
import { Lesson } from './../../../apis/Entities/Lesson';
import { Dialog, DialogContent, DialogContentText, DialogTitle, InputLabel, Input, FormControl, DialogActions, AppBar, Tabs, Tab, Grid, IconButton, TextField, Typography, Box } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { CourseBuilderCardHeader, CourseBuilderContent } from "./../CourseBuilderElements";
import { tabProps, TabPanel }from './TabPanel';
import QuizTable from './QuizTable';
import MultimediaTable from './MultimediaTable';
import { Button } from "../../../values/ButtonElements";
import { BlankStateContainer } from '../../MyProfilePage/ProfileElements';
import { createNewLesson, deleteLesson, updateLesson } from '../../../apis/Lesson/LessonApis';

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

    let [errors, setErrors] = useState<IErrors<boolean>>({
        name: false,
        description: false,
    });

    const openDialog = () => {
        setShowAddLessonDialog(true);
    }
  
    const handleClose = () => {
        setErrors({}) // clear errors from form
        setShowAddLessonDialog(false);
    }

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    }

    const handleDeleteLesson = (lessonId: number) => {
        deleteLesson(lessonId).then((result) => {
            if (result) {
                props.callOpenSnackBar("Lesson successfully deleted", "success")
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
        }).catch(error => { props.callOpenSnackBar(`Error in deleting lesson: ${error}`, "error") });
    }

    const handleUpdateLesson = (lessonId: number) => {
        const selectedLesson = lessons.filter((lesson: Lesson) => lesson.lessonId === lessonId).pop()

        if (selectedLesson !== undefined) {
            updateLesson(selectedLesson.lessonId, selectedLesson.name, selectedLesson.description).then((newLesson) => {

                props.callOpenSnackBar("Lesson successfully updated", "success")

                const updatedLessons = lessons.map((lesson: Lesson) => {
                    if (lesson.lessonId === newLesson.lessonId) {
                        lesson = newLesson
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
            }).catch(error => { props.callOpenSnackBar(`Error in updating lesson: ${error}`, "error") });
        }

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
            props.callOpenSnackBar("Lesson successfully created", "success")
            handleClose()
            setNewLessonName("")
            setNewLessonDescription("")
        }).catch(error => { props.callOpenSnackBar(`Error in creating lesson: ${error}`, "error") });
    }

    return (
        <>
        <Dialog 
            fullWidth
            open={showAddLessonDialog}
            onClose={handleClose}
            aria-labelledby="create-lesson-modal"
            aria-describedby="create-lesson-modal-description"
        >
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
                    fullWidth
                    multiline
                    value={newLessonDescription}
                    onChange={(e) => setNewLessonDescription(e.target.value)}
                  />
                </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>
                Cancel
              </Button>
              <Button primary onClick={handleClickCreateLesson}>
                Create Lesson
              </Button>
            </DialogActions>
        </Dialog>
        <CourseBuilderCardHeader
            title="Lesson Plan"
            action={
                <IconButton disabled={props.isEnrollmentActive} color="primary" onClick={openDialog}>
                    <AddIcon/>&nbsp; Add Lesson
                </IconButton>
            }/>
            {lessons.length === 0 && !props.isEnrollmentActive &&
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
                                            <TextField 
                                                fullWidth 
                                                required
                                                disabled={props.isEnrollmentActive}
                                                id={index.toString()}
                                                label="Lesson Name"
                                                value={lesson.name}
                                                onChange={handleLessonNameChange}/>
                                        </Grid>
                                        <Grid style={{ padding: "0!important"}} item xs={12}>
                                            <TextField 
                                                fullWidth
                                                required
                                                disabled={props.isEnrollmentActive}
                                                id={index.toString()}
                                                label="Lesson Description"
                                                value={lesson.description}
                                                multiline
                                                onChange={handleLessonDescriptionChange}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <QuizTable
                                                isEnrollmentActive={props.isEnrollmentActive}
                                                handleFormDataChange={handleFormDataChange}
                                                selectedLessonId={lesson.lessonId}
                                                quizzes={lesson.quizzes}
                                                lessons={lessons}
                                                callOpenSnackBar={props.callOpenSnackBar}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <MultimediaTable
                                                isEnrollmentActive={props.isEnrollmentActive}
                                                handleFormDataChange={handleFormDataChange}
                                                selectedLessonId={lesson.lessonId}
                                                multimedias={lesson.multimedias}
                                                lessons={lessons}
                                                callOpenSnackBar={props.callOpenSnackBar}
                                            />
                                        </Grid>
                                        <Grid container spacing={3} justifyContent="flex-end">
                                            <Box m={1} pt={2}>
                                                <Button
                                                    disabled={props.isEnrollmentActive}
                                                    primary={!props.isEnrollmentActive}
                                                    big
                                                    onClick={() => handleUpdateLesson(lesson.lessonId)}>
                                                    Update Lesson
                                                </Button>
                                            </Box>
                                            <Box m={1} pt={2}>
                                                <Button
                                                    disabled={props.isEnrollmentActive}
                                                    big
                                                    onClick={() => handleDeleteLesson(lesson.lessonId)}>
                                                    Delete Lesson
                                                </Button>
                                            </Box>
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
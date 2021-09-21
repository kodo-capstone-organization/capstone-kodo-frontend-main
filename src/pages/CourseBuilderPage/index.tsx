import React, { useState, useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { Box, Grid, TextField, Chip, InputAdornment, IconButton, Dialog, DialogTitle, DialogActions, DialogContent} from "@material-ui/core";
import { CourseBuilderCard, CourseBuilderCardHeader, CourseBuilderContainer, CourseBuilderContent } from "./CourseBuilderElements";
import LessonPlan from "./components/LessonPlan";
import { getCourseByCourseId, updateCourse, toggleEnrollmentActiveStatus } from './../../apis/Course/CourseApis';
import { Tag } from "../../apis/Entities/Tag";
import { Lesson } from "../../apis/Entities/Lesson";
import { Multimedia } from "../../apis/Entities/Multimedia"
import { UpdateCourseReq, Course } from "../../apis/Entities/Course";
import { Autocomplete } from "@material-ui/lab";
import { getAllTags } from '../../apis/Tag/TagApis';
import DoneIcon from '@material-ui/icons/Done';
import PublishIcon from '@material-ui/icons/Publish';
import { Button } from "../../values/ButtonElements";

interface IErrors<TValue> {
    [id: string]: TValue;
}

const formReducer = (state: any, event: any) => {
    return {
        ...state,
        [event.name]: event.value
    }
}

function CourseBuilderPage(props: any) {

    const history = useHistory();
    const courseId = props.match.params.courseId;
    const [loading, setLoading] = useState<boolean>(true);

    const [tagLibrary, setTagLibrary] = useState<Tag[]>([]);
    const [bannerImageFile, setBannerImageFile] = useState<File>(new File([""], ""));
    const [isToggleActiveEnrollmentDialogOpen, setIsToggleActiveEnrollmentDialogOpen] = useState<boolean>(false);
    const [courseFormData, setCourseFormData] = useReducer(formReducer, {});
    const [isTutorOfCourse, setIsTutorOfCourse] = useState<boolean>(false);
    var [errors, setErrors] = useState<IErrors<boolean>>({
        name: false,
        description: false,
        price: false
    });
    
    useEffect(() => {
        getCourseByCourseId(courseId).then((receivedCourse: Course) => {
            Object.keys(receivedCourse).map((key, index) => {
                let wrapperEvent = {
                    target: {
                        name: key,
                        value: Object.values(receivedCourse)[index]
                    }
                }
                handleFormDataChange(wrapperEvent)
            }) 
        });
      }, []);

    useEffect(() => {
        getAllTags().then((res: any)=> setTagLibrary(res)).catch(() => console.log("error getting tags."))
    }, [])

    useEffect(() => {
        if (courseFormData.tutor != null) {
            const accountId = window.sessionStorage.getItem("loggedInAccountId");

            if (accountId !== null) {
                setIsTutorOfCourse(parseInt(accountId) === courseFormData.tutor.accountId)
                setLoading(false);
            }
        }

    }, [courseFormData.tutor])

    const handleChipInputChange = (e: object, value: String[], reason: string) => {
        let wrapperEvent = {
            target: {
                name: "courseTags",
                value: value.map((tagTitle: String) => { return { title: tagTitle }})
            }
        }
        return handleFormDataChange(wrapperEvent);
    }

    const handleBannerImageChange = (event: any) => {
        setBannerImageFile(event.target.files[0])

        let wrapperEvent = {
            target: {
                name: "bannerPictureFileName",
                value: event.target.files[0].name 
            }
        }
        handleFormDataChange(wrapperEvent)
    }

    const handleFormDataChange = (event: any) => {
        setCourseFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }

    const handleValidation = () => {
        let formIsValid = true;
        errors = {};

        if (courseFormData.name === "") {
            formIsValid = false;
            errors['name'] = true;
        }

        if (courseFormData.description === "") {
            formIsValid = false;
            errors['description'] = true;
        }

        if (courseFormData.price === "") {
            formIsValid = false;
            errors['price'] = true;
        }

        setErrors(errors);

        return formIsValid;
    }

    const buildUpdateCourseReq = (courseFormData: any) => {
        const updatedCourse = {
            name: courseFormData.name,
            description: courseFormData.description,
            price: courseFormData.price,
            courseId: courseFormData.courseId,
            bannerUrl: bannerImageFile.size === 0 ? courseFormData.bannerUrl : ""
        }

        const updatedCourseTagTitles = courseFormData.courseTags.map((tag: Tag) => tag.title)

        const updatedLessonReqs = courseFormData.lessons.map((lesson: Lesson) => {
            return {
                lesson: lesson,
                quizzes: lesson.quizzes,
                multimediaReqs: lesson.multimedias.map((multimedia: Multimedia) => {
                    return {
                        multimedia: multimedia,
                        multipartFile: multimedia.file
                    }
                })
            }
        })

        // @ts-ignore
        const updateCourseReq: UpdateCourseReq = { course: updatedCourse, courseTagTitles: updatedCourseTagTitles, updateLessonReqs: updatedLessonReqs }
        return updateCourseReq
    }

    const handleUpdateCourse = () => {
        if (!handleValidation()) {
            return
        }

        const updateCourseReq = buildUpdateCourseReq(courseFormData)

        updateCourse(updateCourseReq, bannerImageFile).then((updatedCourse) => {
            console.log(updatedCourse);

            setCourseFormData(updatedCourse)

            history.push(`/overview/${courseFormData.courseId}`)
        })
    }

    const handleOpenToggleEnrollmentDialog = () => {
        setIsToggleActiveEnrollmentDialogOpen(true)
    }

    const handleCloseToggleEnrollmentDialog = () => {
        setIsToggleActiveEnrollmentDialogOpen(false)
    }
    
    const handleToggleConfirmation = () => {
        const myAccountId = window.sessionStorage.getItem("loggedInAccountId")
        
        if (myAccountId !== null)
        {
            toggleEnrollmentActiveStatus(courseFormData.courseId, parseInt(myAccountId)).then((res: any) => {
                // Toggle success, refresh page
                console.log(res);
                window.location.reload();
            }).catch(error => {
                console.log("Error in deletion", error)
            });
        }
        else
        {
            // No account ID found in local storage. Redirect to login
            history.push('/login')
        }
    }

    const  getToggleKeyword = () => {
        return courseFormData.isEnrollmentActive ? "Unpublish" : "Publish"
    }

    const navigateToPreviousPage = () => {
        history.goBack();
    }

    return !loading && ( !isTutorOfCourse ? 
        <h1>You are not a tutor of this course 😡</h1> :       
        <CourseBuilderContainer>
            <CourseBuilderCard id="course-information">
                <CourseBuilderCardHeader
                    title="Course Information"
                    action={
                        <>
                            {courseFormData.isEnrollmentActive && <Chip variant="outlined" size="small" label="Published" style={{ color: "green", border: "1px solid green" }} disabled deleteIcon={<DoneIcon style={{ color: "green" }} />} onDelete={() => ("")}/>}
                            {!courseFormData.isEnrollmentActive && <Chip variant="outlined"  size="small" label="Publish This Course" color="secondary" onClick={handleOpenToggleEnrollmentDialog} deleteIcon={<PublishIcon color="secondary" />} onDelete={() => ("")} />}
                        </>
                    }
                />
                <CourseBuilderContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField required error={errors['name']} id="standard-basic" fullWidth label="Name" name="name" value={courseFormData.name} onChange={handleFormDataChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField required error={errors['description']} id="standard-basic" fullWidth multiline maxRows={3} name="description" label="Description" value={courseFormData.description} onChange={handleFormDataChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                id="start-adornment"
                                type="number"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                value={courseFormData.price}
                                onChange={handleFormDataChange}
                                required
                                error={errors['price']}
                                />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                options={tagLibrary.map((option) => option.title)}
                                defaultValue={courseFormData.courseTags.map((tag: Tag) => tag.title)}
                                onChange={handleChipInputChange}
                                freeSolo
                                renderTags={(value: string[], getTagProps) =>
                                    value.map((option: string, index: number) => (
                                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                    ))}
                                renderInput={(params) => (
                                    <TextField {...params} id="standard-basic" label="Tags"/>
                                )}/>
                        </Grid>
                        <Grid item xs={10}>
                            <TextField id="standard-basic" fullWidth disabled value={courseFormData.bannerPictureFileName} label="Banner Image"></TextField>
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" component="label" big>
                                Change Banner Image
                                <input
                                    id="banner-image-upload"
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleBannerImageChange}
                                />
                            </Button>
                        </Grid>
                    </Grid>
                </CourseBuilderContent>
            </CourseBuilderCard>
            <CourseBuilderCard id="lesson-plan">
                <LessonPlan courseFormData={courseFormData} lessons={courseFormData.lessons} handleFormDataChange={handleFormDataChange}/>
            </CourseBuilderCard>
            <Grid container spacing={3} justify="flex-end">
                <Box m={1} pt={2}>
                    <Button
                        primary
                        big
                        onClick={handleUpdateCourse}>
                        Update Course
                    </Button>
                </Box>
                <Box m={1} pt={2}>
                    <Button
                        big
                        onClick={navigateToPreviousPage}>
                        Cancel
                    </Button>
                </Box>
            </Grid>
            {/* Toggle Enrollment Course Dialog */}
            <Dialog fullWidth open={isToggleActiveEnrollmentDialogOpen} onClose={handleCloseToggleEnrollmentDialog} aria-labelledby="toggle-dialog">

                <DialogTitle id="toggle-dialog-title">
                    { getToggleKeyword() } {courseFormData.name}?
                </DialogTitle>
                <DialogContent>
                    { courseFormData.isEnrollmentActive &&  <>You should not be able to see this.</> }
                    { !courseFormData.isEnrollmentActive &&  <>Users will be able to browse and enroll into your course. However, once this course is published, you <i>can no longer edit its content nor unpublish it.</i></> }
                </DialogContent>
                <br/>
                <DialogActions>
                    <Button onClick={handleCloseToggleEnrollmentDialog}>
                        Cancel
                    </Button>
                    <Button onClick={handleToggleConfirmation} disabled={courseFormData.isEnrollmentActive} primary>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </CourseBuilderContainer>
    )
}

export default CourseBuilderPage;
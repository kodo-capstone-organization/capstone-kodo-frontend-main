import { useState, useEffect, useReducer } from "react";

import { useHistory } from "react-router-dom";

import { Autocomplete } from "@material-ui/lab";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DoneIcon from '@material-ui/icons/Done';
import PublishIcon from '@material-ui/icons/Publish';
import { 
    Box, 
    Grid, 
    TextField, 
    Chip, 
    InputAdornment, 
    Dialog, 
    DialogTitle, 
    DialogActions, 
    DialogContent, 
    Breadcrumbs, 
    Link
} from "@material-ui/core";

import { Tag } from "../../apis/Entities/Tag";
import { 
    UpdateCourseReq, 
    Course 
} from "../../apis/Entities/Course";

import { getAllTags } from '../../apis/Tag/TagApis';
import { 
    getCourseByCourseId, 
    updateCourse, 
    toggleEnrollmentActiveStatus 
} from './../../apis/Course/CourseApis';

import { 
    CourseBuilderCard, 
    CourseBuilderCardHeader, 
    CourseBuilderContainer, 
    CourseBuilderContent 
} from "./CourseBuilderElements";

import LessonPlan from "./components/LessonPlan";

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
    let [errors, setErrors] = useState<IErrors<boolean>>({
        name: false,
        description: false,
        price: false
    });
    
    useEffect(() => {
        getCourseByCourseId(courseId).then((receivedCourse: Course) => {
            Object.keys(receivedCourse).forEach((key, index) => {
                let wrapperEvent = {
                    target: {
                        name: key,
                        value: Object.values(receivedCourse)[index]
                    }
                }
                handleFormDataChange(wrapperEvent)
            }) 
        });
        getAllTags().then((res: any)=> setTagLibrary(res)).catch(() => console.log("error getting tags."))
        if (courseFormData.tutor != null) {
            const accountId = window.sessionStorage.getItem("loggedInAccountId");

            if (accountId !== null) {
                setIsTutorOfCourse(parseInt(accountId) === courseFormData.tutor.accountId)
                setLoading(false);
            }
        }
    }, [courseId, courseFormData.tutor]);

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
        // Clear any existing errors on specific field while retaining other fields' error states
        const fieldName = event.target.name;
        const newErrorObj = Object.assign({}, errors, { [fieldName]: false })
        setErrors(newErrorObj)

        // Set data
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

        // @ts-ignore
        const updateCourseReq: UpdateCourseReq = { course: updatedCourse, courseTagTitles: updatedCourseTagTitles }
        return updateCourseReq
    }

    const handleUpdateCourse = () => {
        if (!handleValidation()) {
            return
        }

        const updateCourseReq = buildUpdateCourseReq(courseFormData)

        updateCourse(updateCourseReq, bannerImageFile)
            .then((updatedCourse) => {
                setCourseFormData(updatedCourse)
                history.push(`/overview/${courseFormData.courseId}`)
                props.callOpenSnackBar("Course information successfully updated", "success")
            })
            .catch((error) => {
                props.callOpenSnackBar(`Error in updating course information: ${error}`, "error")
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
            toggleEnrollmentActiveStatus(courseFormData.courseId, parseInt(myAccountId))
                .then((res: any) => {
                    // Display success message, refresh page
                    props.callOpenSnackBar("Course successfully published", "success")
                    window.location.reload();
                })
                .catch(error => { props.callOpenSnackBar(`Error in publishing course: ${error}`, "error") });
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

    // const navigateToCourseOverview = () => {
    //     history.push(`/overview/${courseFormData.courseId}`)
    // }
    //
    // const navigateToPreviousPage = () => {
    //     history.goBack();
    // }

    return !loading && ( !isTutorOfCourse ? 
        <h1>You are not a tutor of this course 😡</h1> :       
        <CourseBuilderContainer>
            <Breadcrumbs aria-label="coursebuilder-breadcrumb" style={{ marginBottom: "1rem"}}>
                <Link color="primary" href={`/overview/${courseFormData.courseId}`}>
                    <ArrowBackIcon style={{ verticalAlign: "middle"}}/>&nbsp;
                    <span style={{ verticalAlign: "bottom"}}>Back To Overview</span>
                </Link>
            </Breadcrumbs>

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
                            <TextField disabled={courseFormData.isEnrollmentActive} required error={errors['name']} id="standard-basic" fullWidth label="Name" name="name" value={courseFormData.name} onChange={handleFormDataChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField disabled={courseFormData.isEnrollmentActive} id="standard-basic" fullWidth multiline maxRows={3} name="description" label="Description" value={courseFormData.description} onChange={handleFormDataChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={courseFormData.isEnrollmentActive}
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
                                disabled={courseFormData.isEnrollmentActive}
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
                            <Button disabled={courseFormData.isEnrollmentActive} variant="contained" component="label" big>
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
                        <Grid container spacing={3} justifyContent="flex-end">
                            <Box m={1} pt={2}>
                                <Button
                                    disabled={courseFormData.isEnrollmentActive}
                                    primary={!courseFormData.isEnrollmentActive}
                                    big
                                    onClick={handleUpdateCourse}>
                                    Update Course Information
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CourseBuilderContent>
            </CourseBuilderCard>
            <CourseBuilderCard id="lesson-plan">
                <LessonPlan isEnrollmentActive={courseFormData.isEnrollmentActive} courseFormData={courseFormData} lessons={courseFormData.lessons} handleFormDataChange={handleFormDataChange} courseId={courseId} callOpenSnackBar={props.callOpenSnackBar}/>
            </CourseBuilderCard>
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
import { useState, useEffect, useReducer } from "react";

import { useHistory } from "react-router-dom";
import { Box, Grid, TextField, Chip, InputAdornment, Dialog, DialogTitle, DialogActions, DialogContent, Breadcrumbs, Link} from "@material-ui/core";
import { CourseBuilderCard, CourseBuilderCardHeader, CourseBuilderContainer, CourseBuilderContent, MessageContainer } from "./CourseBuilderElements";
import LessonPlan from "./components/LessonPlan";
import { getCourseWithoutEnrollmentByCourseId, updateCourse, toggleReviewRequestStatus } from '../../apis/CourseApis';
import { Tag } from "../../Entities/Tag";
import { UpdateCourseReq, Course } from "../../Entities/Course";
import { Autocomplete } from "@material-ui/lab";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DoneIcon from '@material-ui/icons/Done';
import PublishIcon from '@material-ui/icons/Publish';
import { getAllTags } from '../../apis/TagApis';
import { Button } from "../../values/ButtonElements";
import CircularProgress from '@material-ui/core/CircularProgress';

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
    const [isToggleRequestReviewDialogOpen, setIsToggleRequestReviewDialogOpen] = useState<boolean>(false);
    const [courseFormData, setCourseFormData] = useReducer(formReducer, {});
    const [isTutorOfCourse, setIsTutorOfCourse] = useState<boolean>(false);
    let [errors, setErrors] = useState<IErrors<boolean>>({
        name: false,
        description: false,
        price: false
    });
    
    useEffect(() => {
        getCourseWithoutEnrollmentByCourseId(courseId).then((receivedCourse: Course) => {
            Object.keys(receivedCourse).forEach((key, index) => {
                let wrapperEvent = {
                    target: {
                        name: key,
                        value: Object.values(receivedCourse)[index]
                    }
                }
                handleFormDataChange(wrapperEvent)
            }) 
        }).catch((error) => handleError(error));
        getAllTags().then((res: any)=> setTagLibrary(res)).catch(() => console.log("error getting tags."))
    }, [courseId]);

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
                history.push(`/overview/course/${courseFormData.courseId}`)
                props.callOpenSnackBar("Course information successfully updated", "success")
            })
            .catch((error) => {
                props.callOpenSnackBar(`Error in updating course information: ${error}`, "error")
            })
    }

    const handleOpenToggleRequestReviewDialog = () => {
        setIsToggleRequestReviewDialogOpen(true)
    }

    const handleCloseToggleRequestReviewDialog = () => {
        setIsToggleRequestReviewDialogOpen(false)
    }
    
    const handleToggleConfirmation = () => {
        const myAccountId = window.sessionStorage.getItem("loggedInAccountId")
        
        if (myAccountId !== null)
        {
            toggleReviewRequestStatus(courseFormData.courseId, parseInt(myAccountId))
                .then((res: any) => {
                    // Display success message, refresh page
                    props.callOpenSnackBar("Successfully requested for review", "success")
                    window.location.reload();
                })
                .catch(error => { props.callOpenSnackBar(`Error in requesting for review for course: ${error}`, "error") });
        }
        else
        {
            // No account ID found in local storage. Redirect to login
            history.push('/login')
        }
    }

    const handleError = (err: any) => {
        const errorDataObj = createErrorDataObj(err);
        props.callOpenSnackBar("Error in retrieving course builder information", "error");
        history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj }})
    }
    
    const createErrorDataObj = (err: any) => {
        const errorDataObj = { 
            message1: 'Unable to view course builder',
            message2: err.response.data.message,
            errorStatus: err.response.status,
            returnPath: '/profile',
            returnText: 'My Profile'
        }   
    
        return errorDataObj;
    }



    return loading ? <MessageContainer><CircularProgress/></MessageContainer> : ( !isTutorOfCourse ? 
        <>
            {handleError({
                response: {
                    data: {
                        message: "You are not the tutor of the selected course"
                    },
                    status: 403
                }
            })}
        </> :       
        <CourseBuilderContainer>
            <Breadcrumbs aria-label="coursebuilder-breadcrumb" style={{ marginBottom: "1rem"}}>
                <Link color="primary" href={`/overview/course/${courseFormData.courseId}`}>
                    <ArrowBackIcon style={{ verticalAlign: "middle"}}/>&nbsp;
                    <span style={{ verticalAlign: "bottom"}}>Back To Overview</span>
                </Link>
            </Breadcrumbs>

            <CourseBuilderCard id="course-information">
                <CourseBuilderCardHeader
                    title="Course Information"
                    action={
                        <>
                            {courseFormData.isEnrollmentActive ?
                                <>
                                    <Chip variant="outlined" size="small" label="Published" style={{ color: "green", border: "1px solid green" }} deleteIcon={<DoneIcon style={{ color: "green" }} />} onDelete={() => ("")}/>
                                    &nbsp;&nbsp;
                                    <Chip variant="outlined" size="small" label="View Mode" style={{ color: "blue", border: "1px solid blue" }} disabled />
                                </>  
                                : courseFormData.isReviewRequested ? 
                                    <>
                                        <Chip variant="outlined"  size="small" label="Pending Review" style={{ color: "red", border: "1px solid red" }} disabled />
                                        &nbsp;&nbsp; 
                                        <Chip variant="outlined" size="small" label="View Mode" style={{ color: "blue", border: "1px solid blue" }} disabled />
                                    </>
                                    :
                                    <Chip variant="outlined"  size="small" label="Request for Review" color="secondary" onClick={handleOpenToggleRequestReviewDialog} deleteIcon={<PublishIcon color="secondary" />} onDelete={() => ("")} />}
                        </>
                    }
                />        
                <CourseBuilderContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField disabled={courseFormData.isReviewRequested} required error={errors['name']} id="standard-basic" fullWidth label="Name" name="name" value={courseFormData.name} onChange={handleFormDataChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField disabled={courseFormData.isReviewRequested} id="standard-basic" fullWidth multiline maxRows={3} name="description" label="Description" value={courseFormData.description} onChange={handleFormDataChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={courseFormData.isReviewRequested}
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
                                disabled={courseFormData.isReviewRequested}
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
                        <Grid item xs={courseFormData.isReviewRequested ? 12 : 10}>
                            <TextField id="standard-basic" fullWidth disabled value={courseFormData.bannerPictureFileName} label="Banner Image"></TextField>
                        </Grid>
                        { !courseFormData.isReviewRequested &&
                            <>
                                <Grid item xs={2}>
                                    <Button disabled={courseFormData.isReviewRequested} variant="contained" component="label" big>
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
                                            disabled={courseFormData.isReviewRequested}
                                            primary={!courseFormData.isReviewRequested}
                                            big
                                            onClick={handleUpdateCourse}>
                                            Update Course Information
                                        </Button>
                                    </Box>
                                </Grid>
                            </>
                        }
                    </Grid>
                </CourseBuilderContent>
            </CourseBuilderCard>
            <CourseBuilderCard id="lesson-plan">
                <LessonPlan isEnrollmentActive={courseFormData.isReviewRequested} courseFormData={courseFormData} lessons={courseFormData.lessons} handleFormDataChange={handleFormDataChange} courseId={courseId} callOpenSnackBar={props.callOpenSnackBar}/>
            </CourseBuilderCard>
            {/* Toggle Enrollment Course Dialog */}
            <Dialog fullWidth open={isToggleRequestReviewDialogOpen} onClose={handleCloseToggleRequestReviewDialog} aria-labelledby="toggle-dialog">

                <DialogTitle id="toggle-dialog-title">
                    Request for review to publish {courseFormData.name}?
                </DialogTitle>
                <DialogContent>
                    { courseFormData.isReviewRequested &&  <>You should not be able to see this.</> }
                    { !courseFormData.isReviewRequested &&  <>A Kodo Admin will review this course and publish it once it's approved. Users will be able to browse and enroll into your course. However, once you request for a review, you <i>can no longer edit its content nor unpublish it.</i></> }
                </DialogContent>
                <br/>
                <DialogActions>
                    <Button onClick={handleCloseToggleRequestReviewDialog}>
                        Cancel
                    </Button>
                    <Button onClick={handleToggleConfirmation} disabled={courseFormData.isReviewRequested} primary>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </CourseBuilderContainer>
    )
}

export default CourseBuilderPage;
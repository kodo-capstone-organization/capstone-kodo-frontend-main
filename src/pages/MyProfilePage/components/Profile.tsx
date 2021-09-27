import React, { useEffect, useReducer, useState } from 'react'
import { ProfileCard, ProfileCardHeader, ProfileCardContent, ProfileCardActions, ProfileDetails, ProfileName, ProfileContentText, ProfileSubText, ProfileUsername, BlankStateContainer
} from "../ProfileElements";
import {CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, TextField, Typography } from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { Account } from "../../../apis/Entities/Account";
import { Button } from '../../../values/ButtonElements';
import { createNewCourse } from '../../../apis/Course/CourseApis';
import { Course } from '../../../apis/Entities/Course';
import Chip from '@material-ui/core/Chip';
import { createStripeAccount } from '../../../apis/Stripe/StripeApis';
import { EnrolledCourse } from '../../../apis/Entities/EnrolledCourse';
import { CourseWrapper } from '../../BrowseCourse/BrowseCoursePage/BrowseCourseElements';
import CourseCard from '../../../components/CourseCard';
import { Autocomplete } from '@material-ui/lab';
import { Tag } from '../../../apis/Entities/Tag';
import { getAllTags } from '../../../apis/Tag/TagApis';
import KodoAvatar from '../../../components/KodoAvatar/KodoAvatar';


const formReducer = (state: any, event: any) => {
    if(event.reset) {
        if (event.isErrorForm) {
            return {
                name: '',
                description: '',
                price: '',
                tagTitles: ''
            }
        } else {
            return {
                tutorId: null,
                name: '',
                description: '',
                price: 0,
                tagTitles: []
            }
        }
    }
    
    return {
        ...state,
        [event.name]: event.value
    }
}

function Profile(props: any) {

    const [myAccount, setMyAccount] = useState<Account>({...props.account}); // get from props
    const [isOpen, setIsOpen] = useState<boolean>(false); // create new course dialog
    const [isStripeDialogOpen, setStripeDialogOpen] = useState<boolean>(false);
    const [courseFormData, setCourseFormData] = useReducer(formReducer, {});
    const [courseFormErrors, setCourseFormErrors] = useReducer(formReducer, {});
    const [courseBannerImageFile, setCourseBannerImageFile] = useState<File|null>(null);
    const [createCourseLoading, setCreateCourseLoading] = useState<boolean>(false);
    const [tagLibrary, setTagLibrary] = useState<Tag[]>([]);

    /***********************
     * Use Effects         *
     ***********************/

    useEffect(() => {
        // Reset forms
        setCourseFormData({ reset: true, isErrorForm: false })
        setCourseFormErrors({ reset: true, isErrorForm: true })

        // Get tags
        getAllTags()
            .then((res: any) => setTagLibrary(res))
            .catch(() => console.log("error getting tags"))
    }, [])

    useEffect(() => {
        setMyAccount(props.account)
    }, [props.account])

    /***********************
     * Helper Methods      *
     ***********************/
    
    const navigateToSettingsPage = () => {
        props.history.push('/profile/settings');
    }

    const navigateToFinancialsPage = (tabIdx = 0) => {
        props.history.push({ pathname: '/profile/financials', state: { initialTabIdx: tabIdx }});
    }

    const navigateToBrowseCoursePage = () => {
        props.history.push('/browsecourse');
    }

    const handleFormDataChange = (event: any) => {
        // Clear any existing errors on field
        handleFormErrorChange({ target: { name: event.target.name , value: "" }})

        // Set
        setCourseFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }

    const handleFormErrorChange = (event: any) => {
        setCourseFormErrors({
            name: event.target.name,
            value: event.target.value,
        });
    }

    const handleChipInputChange = (e: object, value: String[], reason: string) => {
        let wrapperEvent = {
            target: {
                name: "tagTitles",
                value: value
            }
        }
        return handleFormDataChange(wrapperEvent);
    }

    const handleClickOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleCreateNewCourseValidation = () => {
        let formIsValid = true

        if (courseFormData.name === "") {
            formIsValid = false
            handleFormErrorChange({ target: { name: "name", value: "Name of course cannot be empty" }})
        }

        if (courseFormData.price === "") {
            formIsValid = false
            handleFormErrorChange({ target: { name: "price", value: "Price of course cannot be empty" }})
        }

        // Check if form is still valid
        if (formIsValid) {
            handleCreateNewCourseSubmit()
        }
    }

    const handleCreateNewCourseSubmit = () => {
        // Set tutorId field
        courseFormData.tutorId = myAccount.accountId;
        setCreateCourseLoading(true);

        // Call API
        createNewCourse(courseFormData, courseBannerImageFile).then((res: Course) => {
            // Cleanup
            setCourseFormData({ reset: true, isErrorForm: false })
            setCourseFormErrors({ reset: true, isErrorForm: true })
            setCourseBannerImageFile(null);
            handleClose();

            // Redirect
            props.history.push(`/builder/${res.courseId}`);
        });

        setCreateCourseLoading(false);
    }

    const invokeStripeAccountCreation = () => {
        setStripeDialogOpen(true);
        createStripeAccount(myAccount.accountId).then((resUrl: string) => {
            let newTab = window.open(resUrl, '_blank');
            newTab?.focus();
        })
    }

    const handleStripeDialogClose = () => {
        // Do nothing. Dont allow closing.
        return;
    }

    return (
        <>
            <ProfileCard id="my-details">
                <ProfileCardHeader
                    title="My Details"
                    action={
                        <IconButton aria-label="settings" color="primary" onClick={navigateToSettingsPage}>
                            <SettingsIcon /> &nbsp; Settings
                        </IconButton>
                    }
                />
                <ProfileCardContent>
                    <KodoAvatar name={myAccount?.name} displayPictureURL={myAccount?.displayPictureUrl}/>
                    <ProfileDetails>
                        <ProfileName>
                            { myAccount?.name }
                        </ProfileName>
                        <ProfileSubText>
                            { myAccount?.email }
                        </ProfileSubText>
                        <ProfileUsername>
                            @{ myAccount?.username }
                        </ProfileUsername>
                    </ProfileDetails>
                </ProfileCardContent>
                <ProfileCardContent removePadTop="true">
                    <ProfileContentText>
                        { myAccount?.bio }
                    </ProfileContentText>
                </ProfileCardContent>
                <ProfileCardActions>
                    <ProfileSubText>
                        My Interests:
                    </ProfileSubText>
                    {
                        myAccount?.interests.map(tag => (
                            <Chip key={tag.title} label={tag.title} variant="outlined" />
                        ))
                    }
                </ProfileCardActions>
            </ProfileCard>
            <ProfileCard id="my-enrolled-courses">
                <ProfileCardHeader
                    title="My Enrolled Courses"
                    action={
                        <IconButton aria-label="transaction history" color="primary" onClick={() => navigateToFinancialsPage(0)}>
                            <ReceiptIcon /> &nbsp; View Payments
                        </IconButton>
                    }
                />
                <ProfileCardContent>
                    { myAccount?.enrolledCourses.length === 0 &&
                        <BlankStateContainer>
                            <Typography variant="h5">You are not enrolled in any courses 🥺</Typography>
                            <br/>
                            <Typography>Try heading over to our Browse Courses page to look through the multitude of courses we have to offer on Kodo. From there, you can choose to enroll in any course that catches your eye!</Typography>
                            <br/>
                            <Button onClick={navigateToBrowseCoursePage} style={{width: "10%" }} big>Browse Courses</Button>
                        </BlankStateContainer>
                    }
                    { myAccount?.enrolledCourses.length > 0 &&
                        <CourseWrapper>
                            { myAccount?.enrolledCourses.map((enrolledCourse: EnrolledCourse) => {
                                return (
                                    <CourseCard
                                        key={enrolledCourse.enrolledCourseId}
                                        course={enrolledCourse.parentCourse} 
                                        myCourseView={false} 
                                        isCourseCompleted={enrolledCourse.dateTimeOfCompletion !== null} 
                                        redirectUrlBase="/overview"
                                    />
                                )})
                            }
                        </CourseWrapper>
                    }
                </ProfileCardContent>
            </ProfileCard>
            <ProfileCard id="my-courses">
                <ProfileCardHeader
                    title="My Courses"
                    action={
                        <>
                            {
                                myAccount?.stripeAccountId === null &&
                                    <Chip
                                        variant="outlined"
                                        size="small"
                                        label="Wallet Not Linked"
                                        color="secondary"
                                        onClick={invokeStripeAccountCreation}
                                    />
                            }
                            {
                                myAccount?.stripeAccountId !== null &&
                                    <>
                                        <Chip variant="outlined" size="small" label="Wallet Linked" style={{ color: "green", border: "1px solid green" }} />
                                        &nbsp;
                                        <IconButton aria-label="create new course" color="primary" onClick={handleClickOpen}>
                                            <AddCircleOutlineIcon /> &nbsp; New Course
                                        </IconButton>
                                        <IconButton aria-label="earnings" color="primary" onClick={() => navigateToFinancialsPage(1)}>
                                            <LocalAtmIcon /> &nbsp; View Earnings
                                        </IconButton>
                                    </>
                            }

                        </>
                    }
                />
                <ProfileCardContent>
                    { myAccount?.courses.length === 0 &&
                        <BlankStateContainer>
                            <Typography variant="h5">You do not own any courses 🧐</Typography>
                            <br/>
                            {
                                myAccount?.stripeAccountId === null &&
                                    <>
                                        <Typography>Want to spread your knowledge on Kodo? Let's get your account's wallet set up first!</Typography>
                                        <br/>
                                        <Button onClick={invokeStripeAccountCreation} style={{width: "10%" }} big>Setup Wallet</Button>
                                    </>
                            }
                            {
                                myAccount?.stripeAccountId !== null &&
                                    <>
                                        <Typography>Your account's wallet is all set! You can now create and customise a course of your very own for other Kodo users to enroll in and learn from you. Hooray!</Typography>
                                        <br/>
                                        <Button onClick={handleClickOpen} style={{width: "10%" }} big>Create New Course</Button>
                                    </>
                            }

                        </BlankStateContainer>
                    }
                    {myAccount?.courses.length > 0 &&
                        <CourseWrapper>
                            { myAccount?.courses.map((myCourse: Course) => {
                                return (
                                    <CourseCard
                                        key={myCourse.courseId}
                                        course={myCourse} 
                                        myCourseView={true} 
                                        isCourseCompleted={false} 
                                        redirectUrlBase="/overview"
                                    />
                                )})
                            }
                        </CourseWrapper>
                    }
                </ProfileCardContent>
            </ProfileCard>

            {/* Create New Course Dialog Component */}

            <Dialog fullWidth open={isOpen} onClose={handleClose} aria-labelledby="create-course-form-dialog">
                <DialogTitle id="create-course-form-title">Create A New Course 📚</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Creating a kodo course is as easy as 1..2..3!
                        <br/>
                        First, enter some basic details of your course below.
                    </DialogContentText>
                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="course-name">Course Name</InputLabel>
                        <Input
                            id="course-name"
                            name="name"
                            value={courseFormData.name || '' }
                            onChange={handleFormDataChange}
                            type="text"
                            error={courseFormErrors.name}
                            placeholder={courseFormErrors.name}
                            autoFocus
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="course-description">Description</InputLabel>
                        <Input
                            id="course-description"
                            name="description"
                            value={courseFormData.description || '' }
                            onChange={handleFormDataChange}
                            type="text"
                            multiline
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="course-price">Price</InputLabel>
                        <Input
                            id="course-price"
                            name="price"
                            defaultValue={0}
                            value={courseFormData.price}
                            onChange={handleFormDataChange}
                            type="number"
                            inputProps={{
                                maxLength: 13,
                                step: "0.1"
                            }}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            error={courseFormErrors.price}
                            placeholder={courseFormErrors.price}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal" style={{ display: "flex", flexDirection: "row", width: "100%"}}>
                        <Grid style={{ width: "80%"}}>
                            <TextField id="banner-image-name" fullWidth disabled value={courseBannerImageFile?.name || ""} label="Banner Image" />
                        </Grid>
                        <Grid style={{ display: "flex", alignItems: "center", marginLeft: "auto"}}>
                            <Button variant="contained"  component="label">
                                Upload Banner
                                <input
                                    id="banner-image-upload"
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={e => {
                                        // @ts-ignore
                                        setCourseBannerImageFile(e.target.files[0])
                                    }}
                                />
                            </Button>
                        </Grid>
                    </FormControl>

                    <DialogContentText>
                        <br/>
                        Now add some tags to your course! You can use spaces in your tags.
                    </DialogContentText>
                    <FormControl fullWidth>
                        <Autocomplete
                            multiple
                            options={tagLibrary.map((tag) => tag.title)}
                            defaultValue={[]}
                            onChange={handleChipInputChange}
                            freeSolo
                            renderTags={(value: string[], getTagProps) =>
                                value.map((tagTitle: string, index: number) => (
                                    <Chip variant="outlined" label={tagTitle} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField {...params} label="Course Tags" />
                            )}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateNewCourseValidation} disabled={createCourseLoading} primary>
                        Create Course
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Stripe Buffering Dialog Component */}

            <Dialog fullWidth open={isStripeDialogOpen} onClose={handleStripeDialogClose} aria-labelledby="stripe-dialog">
                <DialogTitle>Linking To Stripe Account...</DialogTitle>
                <DialogContent style={{ margin: "auto" }}>
                    <CircularProgress />
                    <br/>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default Profile;
import React, { useEffect, useReducer, useState } from 'react'
import { ProfileCard, ProfileCardHeader, ProfileCardContent, ProfileCardActions,
    ProfileAvatar, ProfileInitials, ProfileDetails, ProfileName, ProfileContentText, ProfileSubText, ProfileUsername, BlankStateContainer
} from "../ProfileElements";
import {CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, TextField, Typography } from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Account } from "../../../apis/Entities/Account";
import { Button } from '../../../values/ButtonElements';
import ChipInput from 'material-ui-chip-input';
import { createNewCourse } from '../../../apis/Course/CourseApis';
import { Course } from '../../../apis/Entities/Course';
import Chip from '@material-ui/core/Chip';
import { createStripeAccount } from '../../../apis/Stripe/StripeApis';
import { EnrolledCourse } from '../../../apis/Entities/EnrolledCourse';
import { CourseWrapper } from '../../BrowseCourse/BrowseCoursePage/BrowseCourseElements';
import CourseCard from '../../../components/CourseCard';
import { Alert } from '@material-ui/lab';


const formReducer = (state: any, event: any) => {
    if(event.reset) {
        return {
            tutorId: null,
            name: '',
            description: '',
            price: null,
            tagTitles: []
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
    const [courseBannerImageFile, setCourseBannerImageFile] = useState<File|null>(null);
    const [createCourseLoading, setCreateCourseLoading] = useState<boolean>(false);

    /***********************
     * Use Effects         *
     ***********************/

    useEffect(() => {
        setMyAccount(props.account)
    }, [props.account])

    /***********************
     * Helper Methods      *
     ***********************/

    const avatarInitials = () => {
        if (myAccount?.name) {
            return myAccount?.name.split(" ").map(x => x[0].toUpperCase()).join("")
        } else {
            return "";
        }
    }
    
    const displayPictureURL = () => {
        return myAccount?.displayPictureUrl ? myAccount?.displayPictureUrl : "";
    }

    const navigateToSettingsPage = () => {
        props.history.push('/profile/settings');
    }

    const navigateToEarningsPage = () => {
        props.history.push('/profile/earnings');
    }

    const navigateToBrowseCoursePage = () => {
        props.history.push('/browsecourse');
    }

    const handleFormDataChange = (event: any) => {
        setCourseFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }

    const handleChipInputChange = (newTagTitles: object) => {
        let wrapperEvent = {
            target: {
                name: "tagTitles",
                value: newTagTitles
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

    const handleClickSubmit = () => {
        // Set tutorId field
        courseFormData.tutorId = myAccount.accountId;

        setCreateCourseLoading(true);

        // Call API
        createNewCourse(courseFormData, courseBannerImageFile).then((res: Course) => {
            // Cleanup
            setCourseFormData({ reset: true })
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
                    <ProfileAvatar
                        alt={myAccount?.name}
                        src={displayPictureURL()}
                        style={{ height: "128px", width: "128px" }}
                    >
                        <ProfileInitials>
                            {avatarInitials()}
                        </ProfileInitials>
                    </ProfileAvatar>
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
                <ProfileCardContent removePadTop>
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
                />
                <ProfileCardContent>
                    { myAccount?.enrolledCourses.length === 0 &&
                        <BlankStateContainer>
                            <Typography variant="h5">You are not enrolled in any course 🥺</Typography>
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
                                    <CourseCard course={enrolledCourse.parentCourse} redirectUrlBase="/overview"/>
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
                                        <IconButton aria-label="earnings" color="primary" onClick={navigateToEarningsPage}>
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
                                    <CourseCard course={myCourse} redirectUrlBase="/overview"/>
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
                            value={courseFormData.price || 0 }
                            onChange={handleFormDataChange}
                            type="number"
                            inputProps={{
                                maxLength: 13,
                                step: "0.1"
                            }}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal" style={{ display: "flex", flexDirection: "row"}}>
                        <Grid xs={9}>
                            <TextField id="banner-image-name" fullWidth disabled value={courseBannerImageFile?.name} label="Banner Image"></TextField>
                        </Grid>
                        <Grid xs={3} style={{ display: "flex", alignItems: "center"}}>
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
                        <ChipInput
                            id="course-tags"
                            onChange={(newChips) => handleChipInputChange(newChips)}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleClickSubmit} disabled={createCourseLoading} primary>
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
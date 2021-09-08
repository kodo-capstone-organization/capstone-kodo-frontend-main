import React, { useEffect, useReducer, useState } from 'react'
import { ProfileCard, ProfileCardHeader, ProfileCardContent, ProfileCardActions,
    ProfileAvatar, ProfileInitials, ProfileDetails, ProfileName, ProfileContentText, ProfileSubText, ProfileUsername, BlankStateContainer
} from "../ProfileElements";
import {ButtonGroup, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl, Grid, IconButton, ImageList, Input, InputAdornment, InputLabel, TextField, Typography } from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import { Account } from "../../../apis/Entities/Account";
import { ImageListItem, ImageListItemBar } from '@material-ui/core';
import { fontSizes } from '../../../values/FontSizes';
import { Button } from '../../../values/ButtonElements';
import ChipInput from 'material-ui-chip-input';
import { createNewCourse } from '../../../apis/Course/CourseApis';
import { Course } from '../../../apis/Entities/Course';
import Chip from '@material-ui/core/Chip';
import { createStripeAccount } from '../../../apis/Stripe/StripeApis';


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
    const [courseBannerImageFile, setCourseBannerImageFile] = useState<File>(new File([""], ""));

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

        // Call API
        createNewCourse(courseFormData, courseBannerImageFile).then((res: Course) => {
            // Debug
            console.log("Course created successfully" + res.courseId);

            // Cleanup
            setCourseFormData({ reset: true })
            handleClose();

            // Redirect
            props.history.push(`/builder/${res.courseId}`);
        });
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
                        <ImageList rowHeight={180} style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", overflow: "hidden" }}>
                            { myAccount?.enrolledCourses.map(enrolledCourse => (
                                /* TODO: Vertical Scrolling */
                                <ImageListItem key={enrolledCourse.enrolledCourseId}>
                                    <img src={enrolledCourse.parentCourse.bannerUrl}
                                         alt={enrolledCourse.parentCourse.name}
                                         onError={ (e) => { // @ts-ignore
                                             e.target.onerror = null; e.target.src="placeholder/placeholderbanner.jpg"}
                                         }
                                    />
                                    <ImageListItemBar
                                        title={<strong>{enrolledCourse.parentCourse.name}</strong>}
                                        // subtitle={<span>by <i>@{enrolledCourse.parentCourse.tutor.username}</i></span>}
                                        actionIcon={
                                            <IconButton color="secondary" aria-label={`Resume ${enrolledCourse.parentCourse.name}`}>
                                                <PlayCircleFilledWhiteIcon /> &nbsp;<span style={{fontSize: fontSizes.SUBTEXT }}>Resume</span>
                                            </IconButton>
                                        }
                                    />
                                </ImageListItem>
                            ))
                            }
                        </ImageList>
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
                        <ImageList rowHeight={180} style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-around",
                            overflow: "hidden"
                        }}>
                            {myAccount?.courses.map(course => (
                                /* TODO: Vertical Scrolling */
                                <ImageListItem key={course.courseId}>
                                    <img src={course.bannerUrl}
                                         alt={course.name}
                                         onError={(e) => {
                                             // @ts-ignore
                                             e.target.onerror = null;
                                             // @ts-ignore
                                             e.target.src = "placeholder/placeholderbanner.jpg"
                                         }}
                                    />
                                    <ImageListItemBar
                                        title={<strong>{course.name}</strong>}
                                        // subtitle={<span>by <i>@{enrolledCourse.parentCourse.tutor.username}</i></span>}
                                        actionIcon={
                                            <IconButton color="secondary" aria-label={`Manage ${course.name}`}>
                                                <EditIcon/> &nbsp;<span style={{fontSize: fontSizes.SUBTEXT}}>Manage</span>
                                            </IconButton>
                                        }
                                    />
                                </ImageListItem>
                            ))
                            }
                        </ImageList>
                    }
                </ProfileCardContent>
            </ProfileCard>

            {/* Create New Course Dialog Component */}

            <Dialog fullWidth open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
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
                            value={courseFormData.price || null }
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
                            <TextField id="banner-image-name" fullWidth disabled value={courseBannerImageFile.name} label="Banner Image"></TextField>
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
                    <Button onClick={handleClickSubmit} primary>
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
import React, { useEffect, useReducer, useState } from 'react'
import { ProfileCard, ProfileCardHeader, ProfileCardContent,
    ProfileAvatar, ProfileInitials, ProfileDetails, ProfileName, ProfileEmail, ProfileUsername
} from "../ProfileElements";
import {ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl, IconButton, ImageList, Input, InputAdornment, InputLabel, TextField } from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import EditIcon from '@material-ui/icons/Edit';
import { Account } from "../../../apis/Entities/Account";
import { ImageListItem, ImageListItemBar } from '@material-ui/core';
import { fontSizes } from '../../../values/FontSizes';
import { Button } from '../../../values/ButtonElements';
import ChipInput from 'material-ui-chip-input';
import { createNewCourse } from '../../../apis/Course/CourseApis';
import { Course } from '../../../apis/Entities/Course';


const formReducer = (state: any, event: any) => {
    if(event.reset) {
        return {
            tutorId: null,
            name: '',
            description: '',
            price: 0,
            tagTitles: [],
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
    const [courseFormData, setCourseFormData] = useReducer(formReducer, {});


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
        console.log("on submit")
        console.log(courseFormData);
        const dummyFile = new File([""], "dummyFile");
        createNewCourse(courseFormData, dummyFile).then((res: Course) => {
            console.log("Course created successfully" + res.courseId);

            // Cleanup
            setCourseFormData({ reset: true })
            handleClose();
            // If successful, redirect to coursebuilder

            // Redirect
            props.history.push(`/builder/${res.courseId}`);
        });
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
                        <ProfileEmail>
                            { myAccount?.email }
                        </ProfileEmail>
                        <ProfileUsername>
                            @{ myAccount?.username }
                        </ProfileUsername>
                    </ProfileDetails>
                </ProfileCardContent>
            </ProfileCard>
            <ProfileCard id="my-enrolled-courses">
                <ProfileCardHeader
                    title="My Enrolled Courses"
                />
                <ProfileCardContent>
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
                </ProfileCardContent>
            </ProfileCard>
            <ProfileCard id="my-courses">
                <ProfileCardHeader
                    title="My Courses"
                    action={
                        <>
                            <IconButton aria-label="create new course" color="primary" onClick={handleClickOpen}>
                                <AddCircleOutlineIcon /> &nbsp; New Course
                            </IconButton>
                            <IconButton aria-label="earnings" color="primary" onClick={navigateToEarningsPage}>
                                <LocalAtmIcon /> &nbsp; View Earnings
                            </IconButton>
                        </>
                    }
                />
                <ProfileCardContent>
                    <ImageList rowHeight={180} style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", overflow: "hidden" }}>
                        { myAccount?.courses.map(course => (
                            /* TODO: Vertical Scrolling */
                            <ImageListItem key={course.courseId}>
                                <img src={course.bannerUrl}
                                     alt={course.name}
                                     onError={ (e) => { // @ts-ignore
                                         e.target.onerror = null; e.target.src="placeholder/placeholderbanner.jpg"}
                                     }
                                />
                                <ImageListItemBar
                                    title={<strong>{course.name}</strong>}
                                    // subtitle={<span>by <i>@{enrolledCourse.parentCourse.tutor.username}</i></span>}
                                    actionIcon={
                                        <IconButton color="secondary" aria-label={`Manage ${course.name}`}>
                                            <EditIcon /> &nbsp;<span style={{fontSize: fontSizes.SUBTEXT }}>Manage</span>
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        ))
                        }
                    </ImageList>
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
                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="course-price">Banner Picture (Currently Disabled)</InputLabel>
                        <Input
                            id="banner-image-name"
                            name="banner"
                            type="text"
                            disabled
                        />
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
        </>
    )
}

export default Profile;
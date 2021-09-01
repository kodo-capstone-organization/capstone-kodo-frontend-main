import React, { useEffect, useState } from 'react'
import { ProfileContainer, ProfileCard, ProfileCardHeader, ProfileCardContent,
    ProfileAvatar, ProfileInitials, ProfileDetails, ProfileName, ProfileUsername
} from "./ProfileElements";
import { IconButton, ImageList } from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import { getMyAccount } from "../../apis/Account/AccountApis";
import { Account } from "../../apis/Entities/Account";
import { EnrolledCourse } from '../../apis/Entities/EnrolledCourse';
import { ImageListItem, ImageListItemBar } from '@material-ui/core';
import { fontSizes } from '../../values/FontSizes';


function ProfilePage() {

    const accountId = 4; // To be fetched from localStorage
    const [myAccount, setMyAccount] = useState<Account>();
    const [myEnrolledCourses, setMyEnrolledCourses] = useState<EnrolledCourse[]>();

    /***********************
     * UseEffects          *
     ***********************/

    // Runs on page load only
    useEffect(() => {
        getMyAccount(accountId).then(receivedAccount => {
            setMyAccount(receivedAccount)
        });
    }, [])

    /***********************
     * Helper Methods          *
     ***********************/
    const displayPictureURL = () => {
        return myAccount?.displayPictureUrl ? myAccount?.displayPictureUrl : "";
    }

    const avatarInitials = () => {
        if (myAccount?.name) {
            return myAccount?.name.split(" ").map(x => x[0].toUpperCase()).join("")
        } else {
            return "";
        }
    }

    return (
        <ProfileContainer>
            <ProfileCard id="my-details">
                <ProfileCardHeader
                    title="My Details"
                    action={
                        <IconButton aria-label="settings" color="primary">
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
                    <ImageList>
                        { myAccount?.enrolledCourses.map(enrolledCourse => (
                            <ImageListItem key={enrolledCourse.enrolledCourseId}>
                                <img src={enrolledCourse.parentCourse.bannerUrl}
                                     alt={enrolledCourse.parentCourse.name}
                                     onError={ (e) => { // @ts-ignore
                                         e.target.onerror = null; e.target.src="placeholder/placeholderbanner.jpg"}
                                     }
                                />
                                <ImageListItemBar
                                    title={<strong>{enrolledCourse.parentCourse.name}</strong>}
                                    subtitle={<span>by: @{enrolledCourse.parentCourse.tutor.username}</span>}
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
                        <IconButton aria-label="earnings" color="primary">
                            <LocalAtmIcon /> &nbsp; Earnings
                        </IconButton>
                    }
                />
                <ProfileCardContent>
                </ProfileCardContent>
            </ProfileCard>
        </ProfileContainer>
    )
}

export default ProfilePage

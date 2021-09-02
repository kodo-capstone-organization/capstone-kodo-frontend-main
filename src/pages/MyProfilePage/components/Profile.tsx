import React, { useEffect, useState } from 'react'
import { ProfileCard, ProfileCardHeader, ProfileCardContent,
    ProfileAvatar, ProfileInitials, ProfileDetails, ProfileName, ProfileEmail, ProfileUsername
} from "../ProfileElements";
import { IconButton, ImageList } from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import { Account } from "../../../apis/Entities/Account";
import { ImageListItem, ImageListItemBar } from '@material-ui/core';
import { fontSizes } from '../../../values/FontSizes';

function Profile(props: any) {

    // Get from props
    const [myAccount, setMyAccount] = useState<Account>({...props.account});

    useEffect(() => {
        setMyAccount(props.account)
    }, [props.account])

    /***********************
     * Helper Methods          *
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
    
    // @ts-ignore
    // @ts-ignore
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
                                    subtitle={<span>by <i>@{enrolledCourse.parentCourse.tutor.username}</i></span>}
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
        </>
    )
}

export default Profile;
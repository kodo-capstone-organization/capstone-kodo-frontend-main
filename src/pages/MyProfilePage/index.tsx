import React, {useEffect, useState} from 'react'
import {ProfileContainer, ProfileCard, ProfileCardContent, ProfileAvatar, ProfileInitials, ProfileDetails, ProfileName, ProfileUsername } from "./ProfileElements";
import {getMyAccount} from "../../apis/Account/AccountApis";
import {Account} from "../../apis/Entities/Account";

function ProfilePage() {

    const accountId = 3; // To be fetched from localStorage
    const [myAccount, setMyAccount] = useState<Account>();

    useEffect(() => {
        getMyAccount(accountId).then(receivedAccount => {
            setMyAccount(receivedAccount)
        });
    }, [myAccount?.username])


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
            <ProfileCard>
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
        </ProfileContainer>
    )
}

export default ProfilePage

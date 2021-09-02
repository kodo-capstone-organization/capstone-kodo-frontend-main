import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import { ProfileContainer,  ProfileBreadcrumbItems } from "./ProfileElements";
import { getMyAccount } from "../../apis/Account/AccountApis";
import { Account } from "../../apis/Entities/Account";
import { Breadcrumbs, Link } from '@material-ui/core';
import Profile from './components/Profile';
import ProfileSettings from './components/ProfileSettings';

function MyProfilePage() {

    const accountId = 4; // To be fetched from localStorage
    const [isIndexPage, setIsIndexPage] = useState<Boolean>();
    const [myAccount, setMyAccount] = useState<Account>();
    const history = useHistory();

    // Runs on page load only
    useEffect(() => {
        getMyAccount(accountId).then(receivedAccount => {
            setMyAccount(receivedAccount)
        });
    }, [])

    // To update isIndexPage
    useEffect(() => {
        setIsIndexPage(history.location.pathname === "/profile");
    }, [history.location.pathname])

    return (
        <ProfileContainer>
            <Breadcrumbs aria-label="profile-breadcrumb" style={{ marginBottom: "1rem"}}>
                {
                    ProfileBreadcrumbItems.map((bcitem) => {
                        if (history.location.pathname.includes(bcitem.subpath))
                        {
                            const color = history.location.pathname === bcitem.fullpath ? "primary" : "inherit";
                            return (<Link key={bcitem.fullpath} color={color} href={bcitem.fullpath}>{ bcitem.name }</Link>);
                        }
                        else
                        {
                            return "";
                        }
                    })
                }
            </Breadcrumbs>

            { /* Conditional Rendering of Subpage */}
            { isIndexPage && myAccount && <Profile account={myAccount} history={history}/> }
            { !isIndexPage && <ProfileSettings /> }

        </ProfileContainer>
    )
}

export default MyProfilePage
import React from 'react'
import {
    SidebarContainer,
    SidebarLink,
    SidebarWrapper,
    SidebarMenu,
    Search,
    TrackChanges,
    PersonOutline,
    CallSplit
} from "./SidebarElements";
function Sidebar(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return (
            <SidebarWrapper>
                <SidebarMenu>
                    <SidebarLink to="/browsecourse">
                        <Search />Browse Courses
                    </SidebarLink>
                    <SidebarLink to="/progresspage">
                        <TrackChanges />My Progress
                    </SidebarLink>
                    <SidebarLink to="/profile">
                        <PersonOutline /> My Profile
                    </SidebarLink>
                    <SidebarLink to="/session">
                        <CallSplit /> Sessions
                    </SidebarLink>
                </SidebarMenu>
            </SidebarWrapper>
        )
    } else {
        return null
    }
}

export default Sidebar;

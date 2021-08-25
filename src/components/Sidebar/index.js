import React from 'react'
import {
    SidebarContainer,
    SidebarLink,
    SidebarWrapper,
    SidebarMenu
  } from "./SidebarElements";
function Sidebar() {
    return (
            <SidebarWrapper>
                <SidebarMenu>
                    <SidebarLink to="/browsecourse">
                        Browse Courses
                    </SidebarLink>
                    <SidebarLink to="/progresspage">
                        My Progress
                    </SidebarLink>
                    <SidebarLink to="/profile">
                        My Profile
                    </SidebarLink>
                    <SidebarLink to="/session">
                        Sessions
                    </SidebarLink>
                </SidebarMenu>
            </SidebarWrapper>
    )
}

export default Sidebar;

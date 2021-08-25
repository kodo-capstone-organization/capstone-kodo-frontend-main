import React from 'react'
import {
    SidebarContainer,
    SidebarLink,
    SidebarWrapper,
    SidebarMenu
  } from "./SidebarElements";
const Sidebar = () => {
    return (
            <SidebarWrapper>
                <SidebarMenu>
                    <SidebarLink to="/">
                        Browse Courses
                    </SidebarLink>
                    <SidebarLink to="/">
                        My Progress
                    </SidebarLink>
                    <SidebarLink to="/">
                        My Profile
                    </SidebarLink>
                    <SidebarLink to="/">
                        Sessions
                    </SidebarLink>
                </SidebarMenu>
            </SidebarWrapper>
    )
}

export default Sidebar;

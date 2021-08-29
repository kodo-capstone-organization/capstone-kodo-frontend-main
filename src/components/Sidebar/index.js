import React, { useState, useEffect } from 'react'
import {
    SidebarContainer,
    SidebarLink,
    SidebarWrapper,
    SidebarMenu,
    SidebarItems
} from "./SidebarElements";
function Sidebar(props, {defaultActive}) {

    const location = props.history.location;

    // If no active prop is passed, use `0` instead
    const [activeIndex, setActiveIndex] = useState(defaultActive || 0);

    // Re-renders when the route changes
    useEffect(() => {
        // Get index of item with the same 'route' as the one provided by react router (the current route)
        const activeItem = SidebarItems.findIndex(item => item.route === location.pathname);
        setActiveIndex(activeItem)
    }, [location])

    return (
        <SidebarWrapper>
            <SidebarMenu>
                {
                    SidebarItems.map((item, idx) => {
                        return (
                            <SidebarLink key={item.label} to={item.route} className={idx === activeIndex ? "active" : ""}>
                                {item.icon()}{item.label}
                            </SidebarLink>
                        );
                    })
                }
            </SidebarMenu>
        </SidebarWrapper>
    )
}

export default Sidebar;

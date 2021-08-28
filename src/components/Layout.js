import React, {useEffect, useState} from 'react';
import Sidebar from "./Sidebar";
import TopMenu from "./TopMenu";
import {LayoutContentWrapper, LayoutContentPage} from "./LayoutElements";
import {RouteItemsWithSidebar} from "../routeItems";

function Layout(props) {

    const location = props.history.location;

    const [showSideBar, setShowSideBar] = useState(true);

    useEffect(() => {
        if (RouteItemsWithSidebar.find(item => item.path === location.pathname)) {
            setShowSideBar(true);
        } else {
            setShowSideBar(false)
        }
    }, [location])

    return (
        <div>
            <TopMenu />
            <LayoutContentWrapper>
                { showSideBar && <Sidebar history={props.history}/> }
                <LayoutContentPage showSideBar={showSideBar}>
                    {props.children}
                </LayoutContentPage>
            </LayoutContentWrapper>
        </div>
    );
}

export default Layout;
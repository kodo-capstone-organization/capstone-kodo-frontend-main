import React, {useEffect, useState} from 'react';
import Sidebar from "./Sidebar";
import TopMenu from "./TopMenu";
import {LayoutContentWrapper, LayoutContentPage} from "./LayoutElements";
import {RouteItemsWithSidebar} from "../routeItems";

function Layout(props) {

    const location = props.history.location;

    const [showSideBar, setShowSideBar] = useState(true);

    useEffect(() => {
        if (RouteItemsWithSidebar.find(item => {
            if (item.isDynamic) {
                // Get index of last occurring "/" in both item path and current path
                const lastIdxItem = item.path.lastIndexOf("/")
                const lastIdxCur = location.pathname.lastIndexOf("/")
                return item.path.substring(0, lastIdxItem+1) === location.pathname.substring(0, lastIdxCur+1)
            } else {
                return item.path === location.pathname
            }
        }))
        {
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
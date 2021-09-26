import React, {useEffect, useState} from 'react';
import Sidebar from "./Sidebar";
import TopMenu from "./TopMenu";
import {LayoutContentWrapper, LayoutContentPage} from "./LayoutElements";
import {RouteItemsWithSidebar} from "../routeItems";
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

function Layout(props) {

    const location = props.history.location;

    const [showSideBar, setShowSideBar] = useState(true);

    const [isSnackBarOpen, setIsSnackBarOpen] = useState(true); // TODO: set to false
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackBarSeverity, setSnackBarSeverity] = useState(""); // error, warning, info, success ONLY

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

    const handleCloseSnackBar = () => {
        setIsSnackBarOpen(false)
        setSnackBarMessage("")
        setSnackBarSeverity("")
    }

    return (
        <div>
            <Snackbar
                id="kodo-snackbar"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={isSnackBarOpen}
                onClose={handleCloseSnackBar}
                autoHideDuration={5000}
            >
                <Alert onClose={handleCloseSnackBar} severity={snackBarSeverity}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
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
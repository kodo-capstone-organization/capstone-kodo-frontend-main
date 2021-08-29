import Login from "./pages/Authentication/Login";
import SignUp from "./pages/Authentication/SignUp";
import BrowseCoursePage from "./pages/BrowseCourse/BrowseCoursePage";
import CoursePreviewPage from "./pages/BrowseCourse/CoursePreviewPage";
import ProgressPage from "./pages/ProgressPage";
import ProfilePage from "./pages/MyProfile/ProfilePage";
import Setting from "./pages/MyProfile/Setting";
import SessionPage from "./pages/Sessions/SessionPage";
import React from "react";

export const RouteItemsWithSidebar = [
    {
        path: "/login",
        component: Login
    },
    {
        path: "/signup",
        component: SignUp
    },
    {
        path: "/browsecourse",
        component: BrowseCoursePage
    },
    {
        path: "/browsecourse/preview",
        component: CoursePreviewPage
    },
    {
        path: "/progresspage",
        component: ProgressPage
    },
    {
        path: "/profile",
        component: ProfilePage
    },
    {
        path: "/profile/setting",
        component: Setting
    },
    {
        path: "/session",
        component: SessionPage
    }

]


import BrowseCoursePage from "./pages/BrowseCourse/BrowseCoursePage";
import CoursePreviewPage from "./pages/BrowseCourse/CoursePreviewPage";
import ProgressPage from "./pages/ProgressPage";
import MyProfilePage from "./pages/MyProfilePage";
import SessionPage from "./pages/Sessions/SessionPage";

export const RouteItemsWithSidebar = [
    {
        path: "/browsecourse",
        isDynamic: false,
        component: BrowseCoursePage
    },
    {
        path: "/browsecourse/preview/:courseId",
        isDynamic: true, // dynamic because of :courseId
        component: CoursePreviewPage
    },
    {
        path: "/progresspage",
        isDynamic: false,
        component: ProgressPage
    },
    {
        path: "/profile",
        isDynamic: false,
        component: MyProfilePage
    },
    {
        path: "/profile/settings",
        isDynamic: false,
        component: MyProfilePage // nested page
    },
    {
        path: "/profile/earnings",
        isDynamic: false,
        component: MyProfilePage // nested page
    },
    {
        path: "/session",
        isDynamic: false,
        component: SessionPage
    }
]


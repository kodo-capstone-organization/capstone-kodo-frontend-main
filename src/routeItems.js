import BrowseCoursePage from "./pages/BrowseCourse/BrowseCoursePage";
import CoursePreviewPage from "./pages/BrowseCourse/CoursePreviewPage";
import ProgressPage from "./pages/ProgressPage";
import MyProfilePage from "./pages/MyProfilePage";
import SessionPage from "./pages/Sessions/SessionPage";

export const RouteItemsWithSidebar = [
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
        component: MyProfilePage
    },
    {
        path: "/profile/settings",
        component: MyProfilePage // nested page
    },
    {
        path: "/session",
        component: SessionPage
    }

]


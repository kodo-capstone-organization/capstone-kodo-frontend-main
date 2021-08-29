import BrowseCoursePage from "./pages/BrowseCourse/BrowseCoursePage";
import CoursePreviewPage from "./pages/BrowseCourse/CoursePreviewPage";
import ProgressPage from "./pages/ProgressPage";
import ProfilePage from "./pages/MyProfilePage";
import SettingsPage from "./pages/MyProfilePage/profileSettings";
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
        component: ProfilePage
    },
    {
        path: "/profile/setting",
        component: SettingsPage
    },
    {
        path: "/session",
        component: SessionPage
    }

]


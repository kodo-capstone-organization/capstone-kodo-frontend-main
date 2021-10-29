import BrowseCoursePage from "./pages/BrowseCoursePage";
import CoursePreviewPageWithRouter from "./pages/CoursePreviewPage";
import ProgressPage from "./pages/ProgressPage";
import MyProfilePage from "./pages/ProfilePage";
import CourseOverview from "./pages/CourseViewerPage";
import SessionPage from "./pages/Sessions/SessionPage";
import LiveKodoSessionPage from "./pages/Sessions/LiveKodoSessionPage";
import ForumPage from "./pages/ForumPage";

export const RouteItemsWithSidebar = [
    {
        path: "/browsecourse",
        isDynamic: false,
        component: BrowseCoursePage
    },
    {
        path: "/browsecourse/preview/:courseId",
        isDynamic: true, // dynamic because of :courseId
        component: CoursePreviewPageWithRouter
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
        path: "/profile/financials",
        isDynamic: false,
        component: MyProfilePage // nested page
    },
    {
        path: "/session",
        isDynamic: false,
        component: SessionPage
    }
]

export const RouteItemsWithoutSidePadding = [
    {
        path: "/overview/course/:courseId",
        isDynamic: true,
        component: CourseOverview
    },
    {
        path: "/session/:initAction/:sessionId",
        isDynamic: true,
        component: LiveKodoSessionPage
    },
    {
        path: "/forum/:courseId/category/:forumCategoryId",
        isDynamic: true,
        component: ForumPage // nested page
    },
]

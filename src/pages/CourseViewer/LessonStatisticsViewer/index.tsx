import { useEffect, useState } from "react";
import { withRouter } from "react-router";

import { Course } from "../../../apis/Entities/Course";
import { Lesson } from "../../../apis/Entities/Lesson";
import { Account } from "../../../apis/Entities/Account";
import { EnrolledLessonWithStudentName } from "../../../apis/Entities/EnrolledLesson";

import { getMyAccount } from "../../../apis/Account/AccountApis";
import { getCourseWithoutEnrollmentByCourseId } from "../../../apis/Course/CourseApis";
import { getAllEnrolledLessonsWithStudentNameByParentLessonId } from "../../../apis/EnrolledLesson/EnrolledLessonApis";
import Sidebar from "../Sidebar/Sidebar";

import { LessonStatisticsViewerContainer } from "./LessonStatisticsViewerElements";

import LessonStatisticsViewerHeader from "./components/LessonStatisticsViewerHeader";
import LessonStatisticsViewerTable from "./components/LessonStatisticsViewerTable/LessonStatisticsViewerTable";
import { LayoutContentPage } from "../../../components/LayoutElements";


function LessonStatisticsViewer(props: any) {

    const courseId = props.match.params.courseId;
    const lessonId = props.match.params.lessonId;
    const [account, setAccount] = useState<Account>();
    const [course, setCourse] = useState<Course>();
    const [lesson, setLesson] = useState<Lesson>();
    const [enrolledLessons, setEnrolledLessons] = useState<EnrolledLessonWithStudentName[]>();

    const [loading, setLoading] = useState<Boolean>(true);
  
    const accountId = JSON.parse(
      window.sessionStorage.getItem("loggedInAccountId") || "{}"
    );

    useEffect(() => {
        setLoading(true);
        getMyAccount(accountId).then(account => {
            setAccount(account);
        });
        getCourseWithoutEnrollmentByCourseId(courseId).then(course => {
            setCourse(course);
            course.lessons.forEach((lesson) => {
                if (lesson.lessonId === parseInt(lessonId))
                {
                    setLesson(lesson);
                    return;
                }
            });
        });
        getAllEnrolledLessonsWithStudentNameByParentLessonId(lessonId).then((enrolledLessons) => {
            setEnrolledLessons(enrolledLessons);
            console.log(enrolledLessons);
        })
        setLoading(false);
    }, [accountId, courseId, lessonId]);

    function isCourseTutor(): boolean {
        if (account && course) {
            if (course.tutor.accountId === account.accountId) {
                return true;
            }
        }
        return false;
    }

    return (
        <>
            { (!loading && course && account) &&       
                <>     
                    <div style={{ display: "flex", flexDirection: "row"}}>
                        <Sidebar account={account} course={course} isTutorView={isCourseTutor()}/>                    
                        <LayoutContentPage showSideBar style={{ paddingRight: "10rem"}}>
                            <LessonStatisticsViewerContainer>          
                                <LessonStatisticsViewerHeader lesson={lesson} enrolledLessons={enrolledLessons}></LessonStatisticsViewerHeader>
                                <LessonStatisticsViewerTable enrolledLessons={enrolledLessons}></LessonStatisticsViewerTable>
                            </LessonStatisticsViewerContainer>            
                        </LayoutContentPage>                    
                    </div>                 
                </>
            }
        </>
    );
}

const LessonStatisticsViewerWithRouter = withRouter(LessonStatisticsViewer);
export default LessonStatisticsViewerWithRouter;
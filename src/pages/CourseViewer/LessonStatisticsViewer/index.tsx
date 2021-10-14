import { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { useHistory } from "react-router-dom";

import { Course } from "../../../apis/Entities/Course";
import { Lesson } from "../../../apis/Entities/Lesson";
import { EnrolledLessonWithStudentName } from "../../../apis/Entities/EnrolledLesson";

import { getAllEnrolledLessonsWithStudentNameByParentLessonId } from "../../../apis/EnrolledLesson/EnrolledLessonApis";
import { getCourseWithoutEnrollmentByCourseId } from "../../../apis/Course/CourseApis";
import { isStudentByCourseIdAndAccountId } from "../../../apis/Course/CourseApis";
import { isTutorByCourseIdAndAccountId } from "../../../apis/Course/CourseApis";

import Sidebar from "../Sidebar/Sidebar";

import { LessonStatisticsViewerContainer } from "./LessonStatisticsViewerElements";

import LessonStatisticsViewerHeader from "./components/LessonStatisticsViewerHeader";
import LessonStatisticsViewerTable from "./components/LessonStatisticsViewerTable/LessonStatisticsViewerTable";
import { LayoutContentPage } from "../../../components/LayoutElements";


function LessonStatisticsViewer(props: any) {

    const courseId = props.match.params.courseId;
    const lessonId = props.match.params.lessonId;
    const accountId = JSON.parse(window.sessionStorage.getItem("loggedInAccountId") || "{}");

    const [isTutor, setIsTutor] = useState<Boolean>();
    const [isStudent, setIsStudent] = useState<Boolean>();  
    const [course, setCourse] = useState<Course>();
    const [lesson, setLesson] = useState<Lesson>();
    const [enrolledLessons, setEnrolledLessons] = useState<EnrolledLessonWithStudentName[]>();

    const [loading, setLoading] = useState<Boolean>(true);

    const history = useHistory();

    useEffect(() => {
        setLoading(true);
        isTutorByCourseIdAndAccountId(courseId, accountId)
        .then((tmpIsTutor: boolean) => setIsTutor(tmpIsTutor))
        .catch((err) => handleError(err));
        isStudentByCourseIdAndAccountId(courseId, accountId)
        .then((tmpIsStudent: boolean) => setIsStudent(tmpIsStudent))
        .catch((err) => handleError(err));
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

    function handleError(err: any): void {
        const errorDataObj = createErrorDataObj(err);
        props.callOpenSnackBar("Error in retrieving course", "error");
        history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj }})
    }
    
    function createErrorDataObj(err: any): any {
        const errorDataObj = { 
            message1: 'Unable to view course',
            message2: err.response.data.message,
            errorStatus: err.response.status,
            returnPath: '/browsecourse'
        }

        return errorDataObj;
    }

    return (
        <>
            { (!loading && course) &&       
                <>     
                    <div style={{ display: "flex", flexDirection: "row"}}>
                        <Sidebar course={course} isTutor={isTutor} isStudent={isStudent} />
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
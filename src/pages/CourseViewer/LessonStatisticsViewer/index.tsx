import { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { useHistory } from "react-router-dom";

import { Course } from "../../../apis/Entities/Course";
import { Lesson } from "../../../apis/Entities/Lesson";
import { EnrolledLessonWithStudentName } from "../../../apis/Entities/EnrolledLesson";

import { getAllEnrolledLessonsWithStudentNameByCourseIdAndLessonIdAndAccountId } from "../../../apis/EnrolledLesson/EnrolledLessonApis";
import { getCourseWithoutEnrollmentByCourseIdAndAccountId } from "../../../apis/Course/CourseApis";
import { isStudentByCourseIdAndAccountId } from "../../../apis/Course/CourseApis";
import { isTutorByCourseIdAndAccountId } from "../../../apis/Course/CourseApis";

import Sidebar from "../Sidebar/Sidebar";

import { LessonStatisticsViewerContainer } from "./LessonStatisticsViewerElements";

import LessonStatisticsViewerHeader from "./components/LessonStatisticsViewerHeader";
import LessonStatisticsViewerTable from "./components/LessonStatisticsViewerTable/LessonStatisticsViewerTable";
import { LayoutContentPage } from "../../../components/LayoutElements";


function LessonStatisticsViewer(props: any) {

    const courseId = props.match.params.courseId;
    const lessonId = parseInt(props.match.params.lessonId);
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
        getCourseWithoutEnrollmentByCourseIdAndAccountId(courseId, accountId).then((tmpCourse: Course) => {
            setCourse(tmpCourse);      
            setLesson(filterLessonByLessonId(tmpCourse, lessonId) as Lesson);
        })
        .catch((err) => handleError(err));
        getAllEnrolledLessonsWithStudentNameByCourseIdAndLessonIdAndAccountId(courseId, lessonId, accountId)
        .then((tmpEnrolledLessons: EnrolledLessonWithStudentName[]) => setEnrolledLessons(tmpEnrolledLessons))
        .catch((err) => handleError(err));
        setLoading(false);
    }, [accountId, courseId, lessonId]);

    function handleError(err: any): void {
        const errorDataObj = createErrorDataObj(err);
        props.callOpenSnackBar("Error in retrieving lesson statistics", "error");
        history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj }})
    }
    
    function createErrorDataObj(err: any): any {
        const errorDataObj = { 
            message1: 'Unable to view lesson statistics',
            message2: err.response.data.message,
            errorStatus: err.response.status,
            returnPath: '/browsecourse'
        }

        return errorDataObj;
    }
    
    function filterLessonByLessonId(course: Course, lessonId: number): Lesson {        
        for (const lesson of course.lessons)
        {
            if (lesson.lessonId === lessonId)
            {
                return lesson as Lesson;
            }
        }
        return null as any;
    }

    return (
        <>
            { (!loading && course && lesson && enrolledLessons) &&       
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
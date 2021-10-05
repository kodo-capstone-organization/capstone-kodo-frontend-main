import { useState, useEffect } from "react";

import { Course } from "../../../../apis/Entities/Course";
import { Lesson } from "../../../../apis/Entities/Lesson";
import { EnrolledCourse } from "../../../../apis/Entities/EnrolledCourse";
import { EnrolledLesson } from "../../../../apis/Entities/EnrolledLesson";

import { 
    LessonViewerCardElement, 
    LessonViewerHeaderElement, 
    LessonViewerContentElement,
    LessonTitle,
    CourseTitle
} from "../LessonViewerElements";

function LessonViewerHeader(props: any) {

    const enrolledCourse: EnrolledCourse = props.enrolledCourse;
    const enrolledLesson: EnrolledLesson = props.enrolledLesson;

    const [course, setCourse] = useState<Course>();
    const [lesson, setLesson] = useState<Lesson>();
    
    useEffect(() => {
        if (enrolledCourse != null)
        {
            setCourse(enrolledCourse.parentCourse);
        }
    }, [enrolledCourse]);

    useEffect(() => {
        if (enrolledLesson != null)
        {
            setLesson(enrolledLesson.parentLesson);
        }
    }, [enrolledLesson]);

    return (      
        <>
            { (course && lesson) &&                
                <LessonViewerCardElement>
                    <LessonViewerHeaderElement title="Lesson Overview"/>
                    <LessonViewerContentElement>
                        <LessonTitle>Week {lesson?.sequence}</LessonTitle>
                        <br/>
                        <CourseTitle>{course?.name}</CourseTitle>
                        { lesson.description }
                    </LessonViewerContentElement>
                </LessonViewerCardElement>
            }          
        </>
    );
}

export default LessonViewerHeader;
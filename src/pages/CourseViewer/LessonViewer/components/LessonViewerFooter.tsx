import { useState, useEffect } from "react";

import { Link } from '@material-ui/core';

import { EnrolledCourse } from "../../../../apis/Entities/EnrolledCourse";
import { EnrolledLesson } from "../../../../apis/Entities/EnrolledLesson";
import { Lesson } from "../../../../apis/Entities/Lesson";

import {
    ArrowBackward,
    ArrowForward, 
    NextBtnWrapper,
    PrevBtnWrapper
} from "../LessonViewerElements";

function LessonViewerFooter(props: any) {

    const enrolledCourse: EnrolledCourse = props.enrolledCourse;
    const enrolledLesson: EnrolledLesson = props.enrolledLesson;

    const [lesson, setLesson] = useState<Lesson>();

    useEffect(() => {
        if (enrolledLesson)
        {
            setLesson(enrolledLesson.parentLesson);
        }
    }, [enrolledLesson]);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "row" }}>
                {/* Conditionally render prev button */}
                { (lesson && lesson.sequence !== 1 && enrolledCourse && enrolledLesson) &&
                    <PrevBtnWrapper>
                        <Link
                            type="button"
                            color="primary"
                            href={`/overview/lesson/${enrolledCourse.enrolledCourseId}/${enrolledLesson.enrolledLessonId - 1}`}
                        >
                            <ArrowBackward/> Previous Lesson
                        </Link>
                    </PrevBtnWrapper>
                }

                {/* Conditionally render next button */}
                { (lesson && lesson.sequence !== enrolledCourse?.enrolledLessons.length && enrolledCourse && enrolledLesson) &&
                    <NextBtnWrapper lessonCompleted={enrolledLesson?.dateTimeOfCompletion}>
                        <Link
                            type="button"
                            color="primary"
                            href={`/overview/lesson/${enrolledCourse.enrolledCourseId}/${enrolledLesson.enrolledLessonId + 1}`}
                        >
                            Next Lesson <ArrowForward />
                        </Link>
                    </NextBtnWrapper>
                }
            </div>
        </>
    );
}

export default LessonViewerFooter;

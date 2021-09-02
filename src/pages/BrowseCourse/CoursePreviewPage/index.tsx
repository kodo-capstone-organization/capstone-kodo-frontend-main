import React, { useEffect, useState } from 'react'
import { withRouter } from "react-router";
import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { Course } from "../../../apis/Entities/Course";
import { PreviewContainer } from "./CoursePreviewElements"

function CoursePreviewPage(props: any) {

    const courseId = props.match.params.courseId;

    const [currentCourse, setCourse] = useState<Course>();

    useEffect(() => {
        getCourseByCourseId(courseId).then(receivedCourse => {
            setCourse(receivedCourse);
            console.log(receivedCourse.name);
        })
    }, [])

    return (
        <PreviewContainer>
            <h1>{currentCourse?.name}</h1>
        </PreviewContainer>   
    )
}

const CoursePreviewPageWithRouter = withRouter(CoursePreviewPage);
export default CoursePreviewPageWithRouter
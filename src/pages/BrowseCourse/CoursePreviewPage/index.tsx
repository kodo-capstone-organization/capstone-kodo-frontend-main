import React, { useEffect, useState } from 'react'
import { withRouter } from "react-router";
import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { Course } from "../../../apis/Entities/Course";

function CoursePreviewPage(props: any) {

    const courseId = props.match.params.courseId;

    const [currentCourse, setCourse] = useState<Course>();

    useEffect(() => {
        getCourseByCourseId(courseId).then(receivedCourse => {
            setCourse(receivedCourse);
            console.log(receivedCourse.name);
        })
    }, [])

const courseName = () => {
    if (currentCourse?.name) {
        return currentCourse?.name
    } else {
        return "made a oopsie";
    }
}

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "700px",
                marginLeft: "220px",
                paddingLeft: "380px",
                color: "#000000",
                background: "white",
            }}
        >
           <h1>{courseName}</h1>
        </div>
    )
}

const CoursePreviewPageWithRouter = withRouter(CoursePreviewPage);
export default CoursePreviewPageWithRouter
import React, { useEffect, useState } from 'react'
import { withRouter } from "react-router";
import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { Course } from "../../../apis/Entities/Course";

function CoursePreviewPage(props: any) {

    const courseId = props.match.params.courseId;

    const [currentCourse, setCourse] = useState<Course>();

    useEffect(() => {
        getCourseByCourseId(courseId).then(receivedCourse => {
            setCourse(receivedCourse)
        })
    }, [courseId])

    console.log(currentCourse)

    return (
        <div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
                height: "700px",
                marginLeft: "220px",
                paddingLeft: "380px",
                color: "#000000",
                background: "white",
			}}
		>
			<h1>This is course preview page</h1>
		</div>
    )
}

const CoursePreviewPageWithRouter = withRouter(CoursePreviewPage);
export default CoursePreviewPageWithRouter

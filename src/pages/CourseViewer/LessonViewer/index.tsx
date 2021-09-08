import React from 'react'
import { withRouter } from "react-router";

function LessonViewer(props: any) {
    const lessonId = props.match.params.lessonId;
    const courseId = props.match.params.courseId;
    return (
        <div>
            <h1>{courseId}</h1>
            <h3>{lessonId}</h3>
        </div>
    )
}

const LessonViewerWithRouter = withRouter(LessonViewer)
export default LessonViewerWithRouter;

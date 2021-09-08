import React from 'react'
import { withRouter } from "react-router";

function LessonViewer(props: any) {
    const lessonId = props.match.params.lessonId;
    return (
        <div>
            <h1>{lessonId}</h1>
        </div>
    )
}

const LessonViewerWithRouter = withRouter(LessonViewer)
export default LessonViewerWithRouter;

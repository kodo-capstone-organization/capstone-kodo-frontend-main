import React from 'react'
import { withRouter } from "react-router";


function CoursePreviewPage() {
    return (
        <div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
                height: "860px",
                paddingLeft: "380px",
                color: "#000000",
                background: "white",
			}}
		>
			<h1>This is course preview page</h1>
		</div>
    )
}

//const CoursePreviewPageWithRouter = withRouter(CoursePreviewPage);
export default CoursePreviewPage

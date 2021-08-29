import React from 'react'

function CoursePreviewPage() {
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

//const CoursePreviewPageWithRouter = withRouter(CoursePreviewPage);
export default CoursePreviewPage

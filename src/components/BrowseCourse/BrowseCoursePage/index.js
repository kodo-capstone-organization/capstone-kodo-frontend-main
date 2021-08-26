import React from 'react'
import { Button } from "../../../values/ButtonElements";

function BrowseCoursePage() {
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
			<h1>This is browse course page</h1>
            <Button primary={true} to="/browsecourse/preview">Course Preview withRouter</Button>
		</div>
    )
}

export default BrowseCoursePage

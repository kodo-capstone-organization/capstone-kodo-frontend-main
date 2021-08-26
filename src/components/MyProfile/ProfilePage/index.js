import React from 'react'
import { Button } from "../../../values/ButtonElements";

function ProfilePage() {
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
			<h1>This is Profile Page</h1>
            <Button primary={true} to="/profile/setting">Setting</Button>

		</div>
    )
}

export default ProfilePage

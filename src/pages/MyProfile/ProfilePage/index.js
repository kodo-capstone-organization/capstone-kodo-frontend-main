import React from 'react'
import { Button } from "../../../values/ButtonElements";

function ProfilePage() {
    return (
        <div>
			<h1>This is Profile Page</h1>
            <Button primary={true} big={false} fontBig={false} to="/profile/setting">Setting</Button>
		</div>
    )
}

export default ProfilePage

import React, {useState} from 'react';
//import { useBetween } from "use-between"
import { Button } from "../../../values/ButtonElements";
import {
    InfoCard,
    Title,
    Container,
    TextBox,
    MenuBtn,
    FlexBox,
    Input
} from "./SignUpElements";


function SignUp({isOpen}) {
    const [auth, setAuth] = useState(true);
    const handleChange = () => {
        setAuth(!auth);
    };

    return (
        <>
        <div isOpen={isOpen}
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
                height: "700px",
                marginTop: "50px",
                color: "#000000",
                background: "white",
			}}
		>
            <InfoCard>
                <Input placeholder="Username" />
                <Input placeholder="Password" />
                <FlexBox>
                    <Button primary>Beginner</Button>
                    <Button primary>Intermediate</Button>
                    <Button primary>Expert</Button>
                </FlexBox>
            </InfoCard>
        {/* <Button primary={true} onClick={handleChange}>{auth ? 'Logout' : 'Login'}</Button> */}
		</div>
        </>
    )
}

export default SignUp

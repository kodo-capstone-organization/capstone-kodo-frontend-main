import React, {useState} from 'react';
//import { useBetween } from "use-between"
import { Button } from '../../../values/ButtonElements';



function Login({isOpen}) {
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
                marginLeft: "220px",
                paddingLeft: "380px",
                color: "#000000",
                background: "white",
			}}
		>
        <Button primary={true} onClick={handleChange}>{auth ? 'Logout' : 'Login'}</Button>
		</div>
        </>
    )
}

export default Login

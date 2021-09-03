import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { Button } from "../../../values/ButtonElements";
import { useHistory } from "react-router-dom";
import {
    LoginPaper,
    LoginPaperWrapper,
    LoginForm
} from "./LoginElements";
import TextField from '@material-ui/core/TextField';
import { login } from '../../../apis/Account/AccountApis';
import { type } from 'os';


function Login({ isOpen }) {

    const [auth, setAuth] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let history = useHistory()

    const btnClick = e => {
        setAuth(!auth);
        e.preventDefault();
        login(username, password).then(loginCallback.bind(this, username, password));
    };

    const loginCallback = (username, password, res) => {
        // res is the last param (though not shown in the callback) since its a binded function
        // Set to local storage
        window.sessionStorage.setItem("loggedInAccountId", res);
        window.sessionStorage.setItem("loggedInAccountUsername", username);
        window.sessionStorage.setItem("loggedInAccountPassword", password);
        history.push('/');
        // Redirect to home "/" where the route will conditionally check if logged in or not
        // and redirect accordingly
    }

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
                <LoginPaper elevation={3}>
                    <LoginPaperWrapper>
                        <Typography color="primary" variant="h4">
                            <strong>Login</strong>
                        </Typography>
                        <br/>
                        <form noValidate autoComplete="off">
                            <LoginForm>
                                <TextField id="filled-basic" label="Username" variant="filled" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                                <br/>
                                <TextField id="filled-basic" label="Password" variant="filled" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                            </LoginForm>
                        </form>
                        <br />
                        <Button primary big fontBig onClick={btnClick}>Login</Button>
                    </LoginPaperWrapper>
                </LoginPaper>
            </div>
        </>
    )
}

export default Login

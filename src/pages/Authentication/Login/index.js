import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "../../../values/ButtonElements";
import { useHistory } from "react-router-dom";
import {
    InfoCard,
    Wrapper,
} from "./LoginElements";
import TextField from '@material-ui/core/TextField';
import { login } from '../../../apis/Account/AccountApis';
import { type } from 'os';


function Login({ isOpen }) {

    const [auth, setAuth] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let history = useHistory()

    const useStyles = makeStyles((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '50ch',
            },
        },
    }));

    const classes = useStyles();

    const btnClick = e => {
        setAuth(!auth);
        e.preventDefault();
        login(username, password).then(res => {
            // Set to locale
            window.sessionStorage.setItem("loggedInAccountId", res);
            window.sessionStorage.setItem("loggedInUsername", username);
            window.sessionStorage.setItem("loggedInPassword", password);
            history.push('/progresspage');
        });
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
                    <Wrapper>
                        <form className={classes.root} noValidate autoComplete="off">
                            <TextField id="filled-basic" label="Username" variant="filled" value={username} onChange={e => setUsername(e.target.value)} />
                            <TextField id="filled-basic" label="Password" variant="filled" value={password} onChange={e => setPassword(e.target.value)} />
                            <br />
                            <Button primary onClick={btnClick}>Log In</Button>
                        </form>
                    </Wrapper>
                </InfoCard>
                {/* <Button primary={true} onClick={handleChange}>{auth ? 'Logout' : 'Login'}</Button> */}
            </div>
        </>
    )
}

export default Login

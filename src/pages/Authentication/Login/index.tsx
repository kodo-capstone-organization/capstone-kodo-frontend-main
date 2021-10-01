import React, { useState } from 'react';

import { useHistory } from "react-router-dom";

import { Typography, Input, InputLabel, InputAdornment, } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import { Account } from '../../../apis/Entities/Account';

import { DeactivateAccountResponse } from '../../../apis/Entities/Deactivate';
import { login, reactivateAccount } from '../../../apis/Account/AccountApis';

import { Button } from "../../../values/ButtonElements";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import {
    LoginForm,
    LoginPaper,
    LoginPaperWrapper,
    LoginSettingField
} from "./LoginElements";


interface IErrors<TValue> {
    [id: string]: TValue;
}

function Login(props: any) {

    const [auth, setAuth] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [accountId, setAccountId] = useState(0);
    const [accountEmail, setAccountEmail] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [loginFailed, setLoginFailed] = useState('');
    const [reactivateFailed, setReactivateFailed] = useState('');
    const [open, setOpen] = React.useState(false);
    const [showPassword, setShowPassword] = useState<Boolean>(false);

    let history = useHistory()

    var [errors, setErrors] = useState<IErrors<any>>({
        email: "",
        confirmEmail: ""
    });

    const handleValidation = () => {
        let formIsValid = true;
        errors = {};

        // Email
        if (email === "") {
            formIsValid = false;
            errors["email"] = true;
        }
        if (typeof email !== "undefined") {
            let lastAtPos = email.lastIndexOf('@');
            let lastDotPos = email.lastIndexOf('.');
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') === -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = true;
            }
        }

        // Confirm Email
        if (confirmEmail === "") {
            formIsValid = false;
            errors["confirmEmail"] = true;
        }
        if (typeof confirmEmail !== "undefined") {
            let lastAtPos = confirmEmail.lastIndexOf('@');
            let lastDotPos = confirmEmail.lastIndexOf('.');
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && confirmEmail.indexOf('@@') === -1 && lastDotPos > 2 && (confirmEmail.length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["confirmEmail"] = true;
            }
        }

        setErrors(errors);

        return formIsValid;
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);

        setEmail('');
        setConfirmEmail('');
        setReactivateFailed('');
        setErrors([]);
    };

    const reactivateBtnClick = (e: any) => {
        if (handleValidation())
        {
            if (email === confirmEmail)
            {
                if (accountEmail === email)
                {
                    reactivateAccount(accountId, accountId)
                    .then((res: DeactivateAccountResponse) => {
                        props.callOpenSnackBar("Account successfully reactivated", "success")
                        loginCallback(username, password, accountId);
                    })
                    .catch(err => setLoginFailed("Reactivation Failed!"));
                }
                else
                {
                    setReactivateFailed("Email does not match our records");    
                }
            }
            else
            {
                setReactivateFailed("Email and confirmation does not match");
            }
        }
        else        
        {
            setReactivateFailed("Email or confirmation is not an email");
        }
    }

    const loginBtnClick = (e: any) => {
        setAuth(!auth);
        e.preventDefault();

        login(username, password).then((res: Account) => {
            if (res.isActive)
            {
                loginCallback(username, password, res.accountId);
            }
            else
            {
                setAccountId(res.accountId);
                setAccountEmail(res.email);
                handleOpen();
            }
        })
        .catch(err => setLoginFailed("Login Failed! Please use valid credentials!"));
    }

    const loginCallback = (username: string, password: string, accountId: number) => {

        // res is the last param (though not shown in the callback) since its a binded function
        // Set to local storage
        window.sessionStorage.setItem("loggedInAccountId", JSON.stringify(accountId));
        window.sessionStorage.setItem("loggedInAccountUsername", username);
        window.sessionStorage.setItem("loggedInAccountPassword", password);
        history.push('/');
        // Redirect to home "/" where the route will conditionally check if logged in or not
        // and redirect accordingly
    }

    const showReactivateErrors = () => {
        if (reactivateFailed)
        {
            return(<Alert severity="error">{reactivateFailed}</Alert>);
        }
        else
        {
            return "";
        }
    }

    const showLoginErrors = () => {
        if (loginFailed)
        {
            return(<Alert severity="error">{loginFailed}</Alert>);
        }
        else
        {
            return "";
        }
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <>
            <div
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
                        <form noValidate autoComplete="off" onSubmit={loginBtnClick}>
                            <LoginForm>
                                <InputLabel
                                htmlFor="standard-adornment--username">Username</InputLabel>
                                <Input
                                autoComplete="off"
                                id="standard-adornment-username"
                                value={username}
                                style={{ margin: "0 0 10px 0", width: "100%" }}
                                onChange={e => setUsername(e.target.value)}/>
                                <br/>
                                <InputLabel
                                htmlFor="standard-adornment--password">Old Password</InputLabel>
                                <Input
                                autoComplete="off"
                                id="standard-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                style={{ margin: "0 0 10px 0", width: "100%" }}
                                onChange={e => setPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                </InputAdornment>
                            }
                        />
                            </LoginForm>
                        
                            <br />
                            <button style={{ display: "none" }} type="submit"></button>
                            <Button primary big fontBig onClick={loginBtnClick}>Login</Button>
                            <br />
                            { showLoginErrors() }
                            <br />
                        </form>                        
                    </LoginPaperWrapper>
                </LoginPaper>

                <Dialog open={open} onClose={handleClose}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <DialogTitle id="form-dialog-title">Reactivate Kodo Account</DialogTitle>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <DialogContent>
                        <DialogContentText>
                            <LoginSettingField error={errors["email"]} style={{ margin: "0 0 10px 0" }} label="Email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmail(e.target.value)} />
                            <LoginSettingField error={errors["confirmEmail"]} style={{ margin: "0 0 10px 0" }} label="Confirm Email" value={confirmEmail} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setConfirmEmail(e.target.value)} />                        
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={reactivateBtnClick} primary>
                            Reactivate
                        </Button>                        
                    </DialogActions>
                    <DialogContent>
                        { showReactivateErrors() }
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}

export default Login

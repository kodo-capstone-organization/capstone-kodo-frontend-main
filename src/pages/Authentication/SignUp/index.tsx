import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router';

import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import {
    Autocomplete,
    ToggleButton, 
    ToggleButtonGroup
} from "@material-ui/lab";

import { Account } from "../../../Entities/Account";
import { Button } from "../../../values/ButtonElements";
import { Tag } from "../../../Entities/Tag";
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { createNewAccount } from '../../../apis/AccountApis';
import { getAllTags } from '../../../apis/TagApis';

import {
    SignUpForm,
    SignUpPaper,
    SignUpPaperWrapper
} from "./SignUpElements";

import {
    Chip,
    TextField, 
    Typography,
    Input, 
    InputLabel, 
    InputAdornment
} from "@material-ui/core";


interface IErrors<TValue> {
    [id: string]: TValue;
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

function SignUp(props: any) {

    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [btnTags, setBtnTags] = useState<String[]>([]);
    const [chips, setChips] = useState<String[]>([]);
    const [tagLibrary, setTagLibrary] = useState<Tag[]>([]);
    const [signUpFailed, setSignUpFailed] = useState<String>("");
    const [btnTagFailed, setBtnTagFailed] = useState<Boolean>(false);
    const [showPassword, setShowPassword] = useState<Boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<Boolean>(false);
    var [errors, setErrors] = useState<IErrors<any>>({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        btnTags: "",
        signUp: ""
    });

    const history = useHistory();

    useEffect(() => {
        getAllTags().then(res => setTagLibrary(res)).catch(error => console.log("error getting tags."))
    }, [])

    const classes = useStyles();
    const handleChipChange = (e: object, value: String[], reason: string) => {
        console.log(value)
        setChips(value)
    }

    const handleBtnTag = (event: React.SyntheticEvent, newBtnTag: string) => {
        setBtnTagFailed(false)
        setBtnTags([newBtnTag])
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    };

    const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleValidation = () => {
        let formIsValid = true;
        errors = {};
        setBtnTagFailed(false)

        // Username
        if (username === "") {
            formIsValid = false;
            errors["username"] = true;
        }

        // Name
        if (name === "") {
            formIsValid = false;
            errors["name"] = true;
        }
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

        // Password
        if (password === "") {
            formIsValid = false;
            errors["password"] = true;
        }

        // Confirm Password
        if (confirmPassword === "") {
            formIsValid = false;
            errors["confirmPassword"] = true;
        }

        // Btn
        if (btnTags.length === 0) {
            console.log('btn invalid');
            formIsValid = false;
            errors["btnTags"] = true;
            setBtnTagFailed(true)
        }

        setErrors(errors);
        if (formIsValid) {
            handleSignUp();
        }
        return formIsValid;
    }

    const showErrors = () => {
        if (signUpFailed)
        {
            return(<Alert severity="error">{signUpFailed}</Alert>);
        }
        else
        {
            return "";
        }
    }

    const handleSignUp = () => {
        // const chipsToString = chips.map((chip) => chip.title)
        const tagTitles = btnTags.concat(chips)
        var newUserAccount =
        {
            username,
            password,
            name,
            bio: "",
            email,
            isAdmin: false,
            tagTitles
        }
        
        if (password === confirmPassword)
        {
            //@ts-ignore        
            createNewAccount(newUserAccount, null).then((res: Account) => {
                props.callOpenSnackBar("Account successfully created", "success")
                window.sessionStorage.setItem("loggedInAccountId", JSON.stringify(res.accountId));
                window.sessionStorage.setItem("loggedInAccountUsername", username);
                window.sessionStorage.setItem("loggedInAccountPassword", password);
                history.push('/progresspage');
            }).catch(err => {            
                setSignUpFailed(err.response.data.message)
            })
        }
        else
        {
            setSignUpFailed("Password and confirmation does not match");
        }
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10rem",
                    color: "#000000",
                    background: "white",
                }}
            >
                <SignUpPaper elevation={3}>
                    <SignUpPaperWrapper>
                        <Typography color="primary" variant="h4">
                            <strong>Sign Up</strong>
                        </Typography>
                        <br/>
                        <form className={classes.root} autoComplete="off">
                            <SignUpForm>
                                <InputLabel style={{ textAlign: 'left' }}
                                htmlFor="username">Username</InputLabel>
                                <Input
                                error={errors["username"]}
                                required
                                autoComplete="off"
                                id="username"
                                value={username}
                                style={{ margin: "0 0 10px 0", width: "100%" }}
                                onChange={e => setUsername(e.target.value)}/>
                                <br/>
                                <InputLabel style={{ textAlign: 'left' }}
                                htmlFor="name">Name</InputLabel>
                                <Input
                                error={errors["name"]}
                                required
                                autoComplete="off"
                                id="name"
                                value={name}
                                style={{ margin: "0 0 10px 0", width: "100%" }}
                                onChange={e => setName(e.target.value)}/>
                                <br/>
                                <InputLabel style={{ textAlign: 'left' }}
                                htmlFor="email">Email</InputLabel>
                                <Input
                                error={errors["email"]}
                                required
                                autoComplete="off"
                                id="email"
                                value={email}
                                style={{ margin: "0 0 10px 0", width: "100%" }}
                                onChange={e => setEmail(e.target.value)}/>
                                <br/>
                                <InputLabel style={{ textAlign: 'left' }}
                                htmlFor="password">Password</InputLabel>
                                <Input 
                                error={errors["password"]}
                                autoComplete="off"
                                id="password"
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
                                </InputAdornment>}/>
                                <br/>
                                <InputLabel style={{ textAlign: 'left' }}
                                htmlFor="confirm-password">Confirm Password</InputLabel>
                                <Input
                                error={errors["confirmPassword"]}
                                autoComplete="off"
                                id="confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                style={{ margin: "0 0 10px 0", width: "100%" }}
                                onChange={e => setConfirmPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            onMouseDown={handleMouseDownConfirmPassword}
                                        >
                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                </InputAdornment>}/>
                                <br />
                                <label>Join Kodo as a</label>
                                <br />
                                <ToggleButtonGroup
                                    value={btnTags}
                                    exclusive
                                    onChange={handleBtnTag}
                                    style={{ 
                                        justifyContent: "center"
                                    }}
                                >
                                    <ToggleButton 
                                        style={{ 
                                            borderColor: btnTagFailed ? "#f44336" : "rgba(0, 0, 0, 0.12)",
                                            color: btnTagFailed ? "#f44336" : "rgba(0, 0, 0, 0.38)"                                          
                                        }} 
                                        value="beginner"
                                    >
                                            Beginner
                                    </ToggleButton>
                                    <ToggleButton 
                                        style={{ 
                                            borderColor: btnTagFailed ? "#f44336" : "rgba(0, 0, 0, 0.12)",
                                            color: btnTagFailed ? "#f44336" : "rgba(0, 0, 0, 0.38)"                           
                                        }} 
                                        value="intermediate"
                                    >
                                            Intermediate
                                    </ToggleButton>
                                    <ToggleButton 
                                        style={{ 
                                            borderColor: btnTagFailed ? "#f44336" : "rgba(0, 0, 0, 0.12)",
                                            color: btnTagFailed ? "#f44336" : "rgba(0, 0, 0, 0.38)"                       
                                        }} 
                                        value="expert"
                                    >
                                        Expert
                                    </ToggleButton>
                                </ToggleButtonGroup>
                                <br /><br/>
                                <InputLabel style={{ textAlign: 'left' }}
                                htmlFor="tags">What subjects are you interested in?</InputLabel>
                                <Autocomplete
                                    multiple
                                    options={tagLibrary.map((option) => option.title)}
                                    defaultValue={[]}
                                    onChange={handleChipChange}
                                    freeSolo
                                    renderTags={(value: string[], getTagProps) =>
                                        value.map((option: string, index: number) => (
                                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                />
                                <br />
                                { showErrors() }
                                <br />
                                <Button primary big fontBig onClick={handleValidation}>Sign Up</Button>
                            </SignUpForm>
                        </form>
                    </SignUpPaperWrapper>
                </SignUpPaper>
            </div>
        </>
    )
}

export default SignUp

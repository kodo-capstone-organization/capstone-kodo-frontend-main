import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router';

import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import {
    Autocomplete,
    ToggleButton, 
    ToggleButtonGroup
} from "@material-ui/lab";

import { Account } from "../../../apis/Entities/Account";
import { Button } from "../../../values/ButtonElements";
import { Tag } from "../../../apis/Entities/Tag";

import { createNewAccount } from '../../../apis/Account/AccountApis';
import { getAllTags } from '../../../apis/Tag/TagApis';

import {
    SignUpForm,
    SignUpPaper,
    SignUpPaperWrapper
} from "./SignUpElements";

import {
    Chip,
    TextField, 
    Typography
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

function SignUp() {

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
            return(<Alert variant="filled" severity="error">{signUpFailed}</Alert>);
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
                    marginTop: "1.5em",
                    color: "#000000",
                    background: "white",
                }}
            >
                <SignUpPaper elevation={3}>
                    <SignUpPaperWrapper>
                        { showErrors() }
                        <br />
                        <Typography color="primary" variant="h4">
                            <strong>Sign Up</strong>
                        </Typography>
                        <br/>
                        <form className={classes.root} autoComplete="off">
                            <SignUpForm>
                                <TextField error={errors["username"]} required label="Username" variant="filled" value={username} onChange={e => setUsername(e.target.value)} />
                                <br />
                                <TextField error={errors["name"]} required label="Name" variant="filled" value={name} onChange={e => setName(e.target.value)} />
                                <br />
                                <TextField error={errors["email"]} required label="Email" variant="filled" value={email} onChange={e => setEmail(e.target.value)} />
                                <br />
                                <TextField error={errors["password"]} required type="password" label="Password" variant="filled" value={password} onChange={e => setPassword(e.target.value)} />
                                <br />
                                <TextField error={errors["confirmPassword"]} required type="password" label="Confirm Password" variant="filled" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
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
                                <br />
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
                                        <TextField {...params} variant="filled" label="What subjects are you interested in?" />
                                    )}
                                />
                                <br />
                                <Button onClick={handleValidation}>Sign Up</Button>
                            </SignUpForm>
                        </form>
                    </SignUpPaperWrapper>
                </SignUpPaper>
            </div>
        </>
    )
}

export default SignUp

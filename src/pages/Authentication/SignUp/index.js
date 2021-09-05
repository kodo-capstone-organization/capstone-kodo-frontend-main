import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "../../../values/ButtonElements";
import { InfoCard, Wrapper } from "./SignUpElements";
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ChipInput from 'material-ui-chip-input'
import { createNewAccount } from '../../../apis/Account/AccountApis';
import { getAllAccounts } from '../../../apis/Account/AccountApis';
import { useHistory } from 'react-router';

function SignUp() {

    // const [auth, setAuth] = useState(true);
    const [btnTags, setBtnTags] = useState([]);
    const [tags, setTags] = useState([]);
    const [fields, setFields] = useState({});
    const [errors, setErrors] = useState({});
    const history = useHistory();

    const useStyles = makeStyles((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '50ch',
            },
        },
    }));

    const classes = useStyles();

    const handleTextInputChange = (field, e) => {
        // setAuth(!auth);
        fields[field] = e.target.value;
        setFields(fields);
        // console.log(fields)
        e.preventDefault();
    }

    const handleChipChange = (chip) => {
        setTags(chip)
        console.log("tags", tags)
        fields["tags"] = chip
    }

    const handleBtn = (event, newBtnTag) => {
        setBtnTags([newBtnTag])
        // console.log(btnTags)
        fields["btnTags"] = [newBtnTag]
        setFields(fields);
    }

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;

        //Username
        if (!fields["username"]) {
            formIsValid = false;
            errors["username"] = "Cannot be empty";
        }

        //Name
        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "Cannot be empty";
        }
        //Email
        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Cannot be empty";
        }
        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Email is not valid";
            }
        }

        //Password
        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "Cannot be empty";
        }

        //Btn
        if (!("btnTags" in fields)) {
            console.log('btn invalid');
            formIsValid = false;
            errors["btnTags"] = "Please choose one";
        }

        setErrors(errors);
        console.log('form is valid1', !("btnTags" in fields))
        if (formIsValid) {
            console.log('form is valid2')
            handleSignUp();
        }
        return formIsValid;
    }


    const handleSignUp = () => {
        const tagTitles = fields["btnTags"].concat(fields["tags"])
        var newUserAccount =
        {
            username: fields["username"],
            password: fields["password"],
            name: fields["name"],
            bio: "",
            email: fields["email"],
            isAdmin: false,
            tagTitles
        }
        createNewAccount(newUserAccount, null).then(res => {
            window.sessionStorage.setItem("loggedInAccountId", res);
            window.sessionStorage.setItem("loggedInAccountUsername", fields.username);
            window.sessionStorage.setItem("loggedInAccountPassword", fields.password);
            history.push('/progresspage');
        }).catch(err => {
            console.log('Sign up failed', err);
        }
        )

    };

    return (
        // <>
        <div
            // isOpen={isOpen}
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
                    <form className={classes.root} autoComplete="off">
                        <TextField required label="Username" variant="filled" value={fields["username"]} onChange={e => handleTextInputChange("username", e)} />
                        <span style={{ color: "red" }}>{errors["username"]}</span>
                        <TextField required label="Name" variant="filled" value={fields["name"]} onChange={e => handleTextInputChange("name", e)} />
                        <span style={{ color: "red" }}>{errors["name"]}</span>
                        <TextField required label="Email" variant="filled" value={fields["email"]} onChange={e => handleTextInputChange("email", e)} />
                        <span style={{ color: "red" }}>{errors["email"]}</span>
                        <TextField required type="password" label="Password" variant="filled" value={fields["password"]} onChange={e => handleTextInputChange("password", e)} />
                        <span style={{ color: "red" }}>{errors["password"]}</span>
                        <br />
                        <label>Join Kodo as a</label>
                        <ToggleButtonGroup
                            value={btnTags}
                            exclusive
                            onChange={handleBtn}
                            style={{ justifyContent: "center" }}
                        >
                            <ToggleButton value="beginner"> Beginner
                                </ToggleButton>
                            <ToggleButton value="intermediate" > Intermediate
                                </ToggleButton>
                            <ToggleButton value="expert"> Expert
                                </ToggleButton>
                        </ToggleButtonGroup>
                        <span style={{ color: "red" }}>{errors["btnTags"]}</span>
                        <br />
                        <label>What subjects are you interested in?</label>
                        <ChipInput
                            onChange={(chips) => handleChipChange(chips)}
                        />
                        <Button onClick={handleValidation}>Sign Up</Button>
                    </form>
                </Wrapper>
            </InfoCard>
        </div>
        // </>
    )
}

export default SignUp

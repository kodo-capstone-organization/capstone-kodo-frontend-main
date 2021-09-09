import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "../../../values/ButtonElements";
import { InfoCard, Wrapper } from "./SignUpElements";
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ChipInput from 'material-ui-chip-input';
import Chip from '@material-ui/core/Chip';
import { createNewAccount } from '../../../apis/Account/AccountApis';
import { getAllTags } from '../../../apis/Tag/TagApis';
import { Tag } from "../../../apis/Entities/Tag";
import { Account } from "../../../apis/Entities/Account";
import { useHistory } from 'react-router';
import Autocomplete from '@material-ui/lab/Autocomplete';

interface IErrors<TValue> {
    [id: string]: TValue;
}

function SignUp() {

    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [btnTags, setBtnTags] = useState<String[]>([]);
    const [chips, setChips] = useState<String[]>([]);
    const [tagLibrary, setTagLibrary] = useState<Tag[]>([]);
    const [errors, setErrors] = useState<IErrors<any>>({
        name: "",
        username: "",
        email: "",
        password: "",
        btnTags: ""
    });
    const history = useHistory();

    const useStyles = makeStyles((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '50ch',
            },
        },
    }));

    useEffect(() => {
        getAllTags().then(res => setTagLibrary(res)).catch(error => console.log("error getting tags."))
    }, [])

    const classes = useStyles();
    const handleChipChange = (e: object, value: String[], reason: string) => {
        console.log(value)
        setChips(value)
    }

    const handleBtn = (event: React.SyntheticEvent, newBtnTag: string) => {
        setBtnTags([newBtnTag])
    }

    const handleValidation = () => {
        let formIsValid = true;

        //Username
        if (username === "") {
            formIsValid = false;
            errors["username"] = "Cannot be empty";
        }

        //Name
        if (name === "") {
            formIsValid = false;
            errors["name"] = "Cannot be empty";
        }
        //Email
        if (email === "") {
            formIsValid = false;
            errors["email"] = "Cannot be empty";
        }
        if (typeof email !== "undefined") {
            let lastAtPos = email.lastIndexOf('@');
            let lastDotPos = email.lastIndexOf('.');
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Email is not valid";
            }
        }

        //Password
        if (password === "") {
            formIsValid = false;
            errors["password"] = "Cannot be empty";
        }

        //Btn
        if (btnTags.length === 0) {
            console.log('btn invalid');
            formIsValid = false;
            errors["btnTags"] = "Please choose one";
        }

        setErrors(errors);
        if (formIsValid) {
            handleSignUp();
        }
        return formIsValid;
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
        //@ts-ignore
        createNewAccount(newUserAccount, null).then((res: Account) => {
            window.sessionStorage.setItem("loggedInAccountId", JSON.stringify(res.accountId));
            window.sessionStorage.setItem("loggedInAccountUsername", username);
            window.sessionStorage.setItem("loggedInAccountPassword", password);
            history.push('/progresspage');
        }).catch(err => {
            console.log('Sign up failed', err);
        }
        )

    };

    return (
        <>
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
                            <TextField required label="Username" variant="filled" value={username} onChange={e => setUsername(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["username"]}</span>
                            <TextField required label="Name" variant="filled" value={name} onChange={e => setName(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["name"]}</span>
                            <TextField required label="Email" variant="filled" value={email} onChange={e => setEmail(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["email"]}</span>
                            <TextField required type="password" label="Password" variant="filled" value={password} onChange={e => setPassword(e.target.value)} />
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
                            <Autocomplete
                                multiple
                                id="tags-filled"
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
                            <Button onClick={handleValidation}>Sign Up</Button>
                        </form>
                    </Wrapper>
                </InfoCard>
            </div>
        </>
    )
}

export default SignUp

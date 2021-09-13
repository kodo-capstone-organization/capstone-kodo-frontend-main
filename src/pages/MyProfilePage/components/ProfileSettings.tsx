import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router";
import {
    TextField, Chip, InputAdornment, Input, InputLabel, IconButton,
    FormControl, Grid, Snackbar
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import CloseIcon from '@material-ui/icons/Close';
import {
    ProfileCard, ProfileSettingField, ProfileSubText,
    ProfileAvatar, ProfileInitials, ProfileCardHeader
} from "../ProfileElements";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Button } from "../../../values/ButtonElements";
import { Account } from "../../../apis/Entities/Account";
import { Tag } from "../../../apis/Entities/Tag";
import DeactivateAccountModal from "./DeactivateAccountModal";
import { getAllTags } from '../../../apis/Tag/TagApis';
import { updateAccount } from '../../../apis/Account/AccountApis';

interface IErrors<TValue> {
    [id: string]: TValue;
}

function ProfileSettings(props: any) {

    const [myAccount, setMyAccount] = useState<Account>();
    const [showPassword, setShowPassword] = useState<Boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [interests, setInterests] = useState<string[]>([]);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [isActive, setIsActive] = useState<Boolean>();
    const [tagLibrary, setTagLibrary] = useState<Tag[]>([]);
    const [displayPictureFilename, setDisplayPictureFilename] = useState<string>("");
    
    const [displayPictureFile, setDisplayPictureFile] = useState<File>(new File([], ""));
    var [errors, setErrors] = useState<IErrors<any>>({
        name: "",
        username: "",
        email: "",
        password: "",
        btnTags: "",
        signUp: ""
    });
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const history = useHistory();

    useEffect(() => {
        setPassword(window.sessionStorage.getItem("loggedInAccountPassword") || "")
    }, [])

    useEffect(() => {
        if (props.account !== undefined) {
            setMyAccount(props.account)
            setName(props.account.name)
            setEmail(props.account.email)
            setBio(props.account.bio)
            setIsActive(props.account.isActive)
            setInterests(props.account.interests.map((x: Tag) => x.title))
            setDisplayPictureFilename(props.account.displayPictureFilename)
        }
        getAllTags().then(res => setTagLibrary(res)).catch(error => console.log("error getting tags."))
    }, [props.account])

    const handleSave = () => {
        const updatedAccountObject: Account = {
            accountId: props.account.accountId,
            username: props.account.username,
            name,
            bio,
            email,
            password,
            displayPictureUrl: props.account.displayPictureUrl,
            displayPictureFilename: "", // Computed value on the backend. Cannot be updated.
            isAdmin: props.account.isAdmin,
            isActive: props.account.isActive,
            interests: props.account.interests,
            enrolledCourses: props.account.enrolledCourses,
            courses: props.account.courses,
            studentAttempts: props.account.studentAttempts,
            stripeAccountId: props.account.stripeAccountId,
        }

        const updateAccountReq = {
            account: updatedAccountObject,
            password: password,
            tagTitles: interests,
            enrolledCourseIds: null,
            courseIds: null,
            forumThreadIds: null,
            forumPostIds: null,
            studentAttemptIds: null,
        }
        //@ts-ignore
        updateAccount(updateAccountReq, displayPictureFile).then((res) => {
            window.sessionStorage.setItem("loggedInAccountPassword", password); // re-set the password in storage in case it is updated
            history.push("/profile")
        }).catch(err => { console.log("error", err) })
    }

    const displayPictureURL = () => {

        if (displayPictureFile.size !== 0)
        {
            // Check for new display picture
            const tempPath = (window.URL || window.webkitURL).createObjectURL(displayPictureFile);
            return tempPath;
        }
        else
        {
            // Else return old dp
            return myAccount?.displayPictureUrl ? myAccount?.displayPictureUrl : "";
        }
    }
    const avatarInitials = () => {
        if (myAccount?.name) {
            return myAccount?.name.split(" ").map(x => x[0].toUpperCase()).join("")
        } else {
            return "";
        }
    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleValidation = () => {
        let formIsValid = true;
        errors = {};

        //Name
        if (name === "") {
            formIsValid = false;
            errors["name"] = true;
        }
        //Email
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

        //Password
        if (password === "") {
            formIsValid = false;
            errors["password"] = true;
        }

        setErrors(errors);
        if (formIsValid) {
            handleSave();
        }
        console.log('validate', formIsValid)
        return formIsValid;
    }

    const handleSnackbar = () => {
        setOpenSnackbar(!openSnackbar);
    };

    const handleChipChange = (e: object, value: string[], reason: string) => {
        console.log(value)
        setInterests(value)
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <>
            {
                myAccount !== null &&
                <ProfileCard id="my-details">
                    <ProfileCardHeader
                        title="Account Settings"
                    />
                    <form noValidate autoComplete="off" style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ padding: "20px"}}>
                            <ProfileAvatar
                                alt={myAccount?.username}
                                src={displayPictureURL()}
                                style={{ height: "128px", width: "128px", margin: "auto" }}
                            >
                                <ProfileInitials>
                                    {avatarInitials()}
                                </ProfileInitials>
                            </ProfileAvatar>
                            <br/>
                            <ProfileSubText style={{ textAlign: "center" }}>
                                Status: <Chip variant="outlined" label={isActive ? "Activated" : "Deactivated"} style={{ color: isActive ? "green" : "red", border: isActive ? "1px solid green" : "1px solid red" }} />
                            </ProfileSubText>
                            <DeactivateAccountModal account={myAccount} style={{ margin: "auto" }} />
                        </div>
                        <div id="profile-details" style={{ margin: "20px", width: "70%" }}>
                            <ProfileSettingField error={errors["name"]} style={{ margin: "0 0 10px 0" }} label="Name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName(e.target.value)} />
                            <ProfileSettingField error={errors["email"]} style={{ margin: "0 0 10px 0" }} label="Email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmail(e.target.value)} />
                            <ProfileSettingField style={{ margin: "0 0 10px 0" }} multiline label="Bio" value={bio} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setBio(e.target.value)} />
                            <InputLabel
                                style={{
                                    color: "rgba(0, 0, 0, 0.54)",
                                    padding: "0",
                                    fontSize: "0.75rem",
                                    lineHeight: "1",
                                    letterSpacing: "0.00938em"
                                }}
                                htmlFor="standard-adornment-password">Password</InputLabel>
                            <Input
                                error={errors["password"]}
                                id="standard-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                style={{ margin: "0 0 10px 0", width: "100%" }}
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPassword(e.target.value)}
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
                            <Autocomplete
                                multiple
                                options={tagLibrary.map((option) => option.title)}
                                value={interests}
                                onChange={handleChipChange}
                                freeSolo
                                renderTags={(value: string[], getTagProps) =>
                                    value.map((option: string, index: number) => (
                                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField {...params} variant="standard" label="Interests" />
                                )}
                            />
                            <FormControl margin="normal" style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                                <Grid style={{ width: "80%"}}>
                                    <TextField id="banner-image-name" fullWidth disabled value={displayPictureFilename} label="Display Picture"></TextField>
                                </Grid>
                                <Grid style={{ display: "flex", alignItems: "center", marginLeft: "auto"}}>
                                    <Button variant="contained" component="label">
                                        Change Display Picture
                                        <input
                                            id="banner-image-upload"
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={e => {
                                                // @ts-ignore
                                                setDisplayPictureFile(e.target.files[0])
                                                // @ts-ignore
                                                setDisplayPictureFilename(e.target.files[0].name)
                                            }}
                                        />
                                    </Button>
                                </Grid>
                            </FormControl>
                            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                                <Button style={{ margin: "10px 0 10px 0" }}
                                    primary
                                    onClick={handleValidation}>
                                    Save
                                </Button>
                                <div style={{ width: "10px" }}></div>
                                <Button
                                    style={{ margin: "10px 0 10px 0" }}
                                    to="/profile"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </form>

                </ProfileCard>
            }
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbar}
                message="Profile Updated."
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbar}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </>
    )
}

export default ProfileSettings;
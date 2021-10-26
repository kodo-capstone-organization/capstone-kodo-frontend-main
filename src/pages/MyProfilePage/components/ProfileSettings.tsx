import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import DeactivateAccountModal from "./DeactivateAccountModal";
import ChangePasswordModal from "./ChangePasswordModal";
import React, { useEffect, useState } from 'react';
import { Account } from "../../../Entities/Account";
import { Autocomplete } from "@material-ui/lab";
import { Button } from "../../../values/ButtonElements";
import { Tag } from "../../../Entities/Tag";
import { getAllTags } from '../../../apis/TagApis';
import { updateAccount } from '../../../apis/AccountApis';
import { useHistory } from "react-router";
import {
    Chip, 
    FormControl, 
    Grid, 
    IconButton,
    Snackbar,
    TextField
} from "@material-ui/core";
import {
    ProfileCard, 
    ProfileCardHeader,
    ProfileSettingField, 
    ProfileSubText
} from "../ProfileElements";
import KodoAvatar from '../../../components/KodoAvatar/KodoAvatar';

interface IErrors<TValue> {
    [id: string]: TValue;
}

function ProfileSettings(props: any) {

    const [myAccount, setMyAccount] = useState<Account>();
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
        btnTags: "",
        signUp: ""
    });
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const history = useHistory();

    const [updateAccountFailed, setUpdateAccountFailed] = useState<String>("");

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
            password: "",
            bio,
            email,            
            displayPictureUrl: props.account.displayPictureUrl,
            displayPictureFilename: "", // Computed value on the backend. Cannot be updated.
            isAdmin: props.account.isAdmin,
            isActive: props.account.isActive,
            interests: props.account.interests,
            enrolledCourses: props.account.enrolledCourses,
            courses: props.account.courses,
            stripeAccountId: props.account.stripeAccountId,
        }

        // Without this line, the JSON passed over will fail as the BE side will try to use the
        // setPassword method and will throw the exception immediately
        updatedAccountObject.password = null;

        const updateAccountReq = {
            account: updatedAccountObject,
            tagTitles: interests,
            enrolledCourseIds: [],
            courseIds: [],
            forumThreadIds: [],
            forumPostIds: [],
            studentAttemptIds: []
        }
        //@ts-ignore
        updateAccount(updateAccountReq, displayPictureFile).then((res) => {
            props.callOpenSnackBar("Profile successfully updated", "success");
            history.push("/profile")
        }).catch(err => {
            props.callOpenSnackBar("Error in updating profile", "error");
            setUpdateAccountFailed(err.response.data.message);
        })
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
        setInterests(value)
    }

    // const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     event.preventDefault();
    // };

    const showErrors = () => {
        if (updateAccountFailed)
        {
            return(<Alert severity="error">{updateAccountFailed}</Alert>);
        }
        else
        {
            return "";
        }
    }

    return (
        <>

            {
                myAccount !== null &&
                <ProfileCard id="my-details">
                    <ProfileCardHeader title="Account Settings"/>
                    <div style={{ margin: "10px 4.5em 10px 4.5em"}}>
                        { showErrors() }
                    </div>
                    <form noValidate autoComplete="off" style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ padding: "20px"}}>
                            <KodoAvatar name={myAccount?.name} displayPictureURL={displayPictureURL()}/>
                            <br/>
                            <ProfileSubText style={{ textAlign: "center" }}>
                                Status: <Chip variant="outlined" label={isActive ? "Activated" : "Deactivated"} style={{ color: isActive ? "green" : "red", border: isActive ? "1px solid green" : "1px solid red" }} />
                            </ProfileSubText>
                            <DeactivateAccountModal account={myAccount} style={{ margin: "auto" }} />
                            <ChangePasswordModal account={myAccount} style={{ margin: "auto" }} callOpenSnackBar={props.callOpenSnackBar} />
                        </div>
                        <div id="profile-details" style={{ margin: "20px", width: "70%" }}>
                            <ProfileSettingField error={errors["name"]} style={{ margin: "0 0 10px 0" }} label="Name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName(e.target.value)} />
                            <ProfileSettingField error={errors["email"]} style={{ margin: "0 0 10px 0" }} label="Email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmail(e.target.value)} />
                            <ProfileSettingField style={{ margin: "0 0 10px 0" }} multiline label="Bio" value={bio} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setBio(e.target.value)} />
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
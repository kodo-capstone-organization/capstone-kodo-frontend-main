import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { TextField, Chip, InputAdornment, Input, InputLabel, IconButton } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        input: {
            display: 'none',
        },
        // root: {
        //     '& .MuiProfileSettingField-root': {
        //         margin: theme.spacing(2),
        //         width: '25ch',
        //     },
        // },
    }),
);


function ProfileSettings(props: any) {

    const [myAccount, setMyAccount] = useState<Account>();
    const [showPassword, setShowPassword] = useState<Boolean>(false);
    const [password, setPassword] = useState<String | null>('');
    const [interests, setInterests] = useState<String[]>([]);
    const [name, setName] = useState<String>("");
    const [email, setEmail] = useState<String>("");
    const [bio, setBio] = useState<String>("");
    const [isActive, setIsActive] = useState<Boolean>();
    const [tagLibrary, setTagLibrary] = useState<Tag[]>([]);
    const classes = useStyles();

    useEffect(() => {
        setMyAccount(props.account)
        setPassword(window.sessionStorage.getItem("loggedInAccountPassword"))
        if (props.account !== undefined) {
            setName(props.account.name)
            setEmail(props.account.email)
            setBio(props.account.bio)
            setIsActive(props.account.isActive)
            setInterests(props.account.interests.map((x: Tag) => x.title))

        }
        getAllTags().then(res => setTagLibrary(res)).catch(error => console.log("error getting tags."))
    }, [props.account])

    const save = () => {
        
    }

    const displayPictureURL = () => {
        return myAccount?.displayPictureUrl ? myAccount?.displayPictureUrl : "";
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
    const handleAddChip = (interest: string) => {
        interests.push(interest)
        setInterests(interests)
    };

    const handleChipChange = (e: object, value: String[], reason: string) => {
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
                    <form
                        // className={classes.root}
                        noValidate autoComplete="off" style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ padding: "20px" }}>
                            <ProfileAvatar
                                alt={myAccount?.username}
                                src={displayPictureURL()}
                                style={{ height: "128px", width: "128px", margin: "auto" }}
                            >
                                <ProfileInitials>
                                    {avatarInitials()}
                                </ProfileInitials>
                            </ProfileAvatar>
                            <input
                                accept="image/*"
                                className={classes.input}
                                id="contained-button-file"
                                multiple
                                type="file"
                            />
                            <label htmlFor="contained-button-file">
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    component="span"                                    
                                    style={{ margin: "10px" }}>
                                    Change Display Picture
                                </Button>
                            </label>
                            <ProfileSubText style={{textAlign:"center"}}>Status: <Chip variant="outlined" label={isActive ? "Activated" : "Deactivated"} style={{ color: isActive ? "green" : "red", border: isActive ? "1px solid green" : "1px solid red" }} /></ProfileSubText>
                            <DeactivateAccountModal account={myAccount} style={{ margin: "auto" }} />
                        </div>
                        <div style={{ margin: "20px" }}>
                            <ProfileSettingField style={{ margin: "0 0 10px 0" }} label="Name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName(e.target.value)} />
                            <ProfileSettingField style={{ margin: "0 0 10px 0" }} label="Email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmail(e.target.value)} />
                            <ProfileSettingField style={{ margin: "0 0 10px 0" }} label="Bio" value={bio} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setBio(e.target.value)} />
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
                            <label style={{
                                    color: "rgba(0, 0, 0, 0.54)",
                                    padding: "0",
                                    fontSize: "0.75rem",
                                    lineHeight: "1",
                                    letterSpacing: "0.00938em"
                                }}>Interests</label>
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
                            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                                <Button style={{ margin: "10px 0 10px 0" }}
                                    primary
                                    onClick={save}>
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
        </>
    )
}

export default ProfileSettings;
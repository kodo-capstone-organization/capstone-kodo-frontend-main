import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ChipInput from 'material-ui-chip-input';
import {
    ProfileCard, ProfileSettingField, ProfileSubText,
    ProfileAvatar, ProfileInitials, ProfileCardHeader
} from "../ProfileElements";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import { Button } from "../../../values/ButtonElements";
import { Account } from "../../../apis/Entities/Account";
import { Tag } from "../../../apis/Entities/Tag";
import DeactivateAccountModal from "./DeactivateAccountModal";
import { Chip } from '@material-ui/core';

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
    }, [props.account])

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

    const handleDeleteChip = (interest: string, index: number) => {
        interests.filter(x => x !== interest)
        setInterests(interests)
    };
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
                        noValidate autoComplete="off" style={{ display: "flex" }}>
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
                                <Button variant="contained" color="primary" component="span"
                                    style={{ margin: "10px" }}>
                                    Change Display Picture
                            </Button>
                            </label>
                            <ProfileSubText style={{textAlign:"center"}}>Status: <Chip variant="outlined" label={isActive ? "Activated" : "Deactivated"} style={{ color: isActive ? "green" : "red", border: isActive ? "1px solid green" : "1px solid red" }} /></ProfileSubText>
                        </div>
                        <div style={{ margin: "20px" }}>
                            <ProfileSettingField label="Name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName(e.target.value)} />
                            <ProfileSettingField label="Email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmail(e.target.value)} />
                            <ProfileSettingField label="Bio" value={bio} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setBio(e.target.value)} />
                            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                style={{ width: "100%" }}
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
                            <label>Interests</label>
                            <ChipInput
                                value={interests}
                                onAdd={(interest) => handleAddChip(interest)}
                                onDelete={(interest, index) => handleDeleteChip(interest, index)}
                            />
                        </div>
                    </form>
                    <DeactivateAccountModal account={myAccount} style={{ margin: "auto" }} />
                </ProfileCard>
            }
        </>
    )
}

export default ProfileSettings;
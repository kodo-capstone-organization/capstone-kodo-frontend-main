import React, { useEffect, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import ChipInput from 'material-ui-chip-input'
import {
    ProfileCard, ProfileSettingField, ProfileCardContent,
    ProfileAvatar, ProfileInitials, ProfileDetails, ProfileName, ProfileEmail, ProfileUsername
} from "../ProfileElements";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Button } from "../../../values/ButtonElements";
import { Account } from "../../../apis/Entities/Account";
import { Tag } from "../../../apis/Entities/Tag";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        input: {
            display: 'none',
        },
    }),
);

function ProfileSettings(props: any) {

    const [myAccount, setMyAccount] = useState<Account>({ ...props.account });
    const [accountToSubmit, setAccountToSubmit] = useState<Account>(myAccount);
    const [showPassword, setShowPassword] = useState<Boolean>(false);
    const [password, setPassword] = useState<String | null>('');
    const [chips, setChips] = useState<String[]>([]);
    const classes = useStyles();

    useEffect(() => {
        setMyAccount(props.account)
        setPassword(window.sessionStorage.getItem("loggedInAccountPassword"))
    }, [props.account])

    const handleChipChange = (chip: String[]) => {
        setChips(chip)
    }

    const handleFieldChange = (field: String, e: React.SyntheticEvent) => {
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

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <>
            <ProfileCard id="my-details">
                Edit Profile
                <form
                    // className={classes.root}
                    noValidate autoComplete="off">
                    <ProfileSettingField>
                        <ProfileAvatar
                            alt={myAccount?.username}
                            src={displayPictureURL()}
                            style={{ height: "128px", width: "128px" }}
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
                            <Button variant="contained" color="primary" component="span">
                                Change Display Picture
                        </Button>
                        </label>
                    </ProfileSettingField>
                    <ProfileDetails>
                        <ProfileName>
                            {myAccount?.name}
                        </ProfileName>
                        <ProfileEmail>
                            {myAccount?.email}
                        </ProfileEmail>
                        <ProfileUsername>
                            @{myAccount?.username}
                        </ProfileUsername>
                    </ProfileDetails>
                    <TextField fullWidth label="Name" defaultValue={accountToSubmit?.name} />
                    <TextField fullWidth label="Username" defaultValue={accountToSubmit?.email} />
                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        // onChange={handleChange('password')}
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
                    <InputLabel htmlFor="chips-input">Tag</InputLabel>
                    <ChipInput
                    id="chips-input"
                    style={{display:"flex"}}
                        onChange={(chips) => handleChipChange(chips)}
                        defaultValue={chips}
                    />
                    <TextField fullWidth label="Bio" defaultValue={accountToSubmit?.bio} />

                </form>
            </ProfileCard>

        </>
    )
}

export default ProfileSettings;
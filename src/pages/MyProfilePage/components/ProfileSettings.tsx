import React, { useEffect, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import ChipInput from 'material-ui-chip-input'
import {
    ProfileCard, ProfileSettingField, ProfileCardContent,
    ProfileAvatar, ProfileInitials, ProfileDetails, ProfileName, ProfileSubText, ProfileUsername
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
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
    }),
);


function ProfileSettings(props: any) {

    const [myAccount, setMyAccount] = useState<Account>();
    const [showPassword, setShowPassword] = useState<Boolean>(false);
    const [password, setPassword] = useState<String | null>('');
    const [chips, setChips] = useState<String[]>([]);
    const [name, setName] = useState<String>("");
    const [fields, setFields] = useState<any>({});
    const classes = useStyles();

    // type FormInputs = {
    //     name: string;
    //     email: string;
    //     displayPicture: string;
    //     bio: string;
    //     password: string;
    //     interests: Array<string>;
    // };

    useEffect(() => {
        setMyAccount(props.account)
        setPassword(window.sessionStorage.getItem("loggedInAccountPassword"))
        if(props.account !== undefined){
            setName(props.account.name)
            setFields(props.account)
        }
    }, [props.account])

    const handleChipChange = (chip: String[]) => {
        setChips(chip)
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
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
            {
                myAccount !== null &&
                <ProfileCard id="my-details">
                    Edit Profile
                <form className={classes.root}
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
                        <TextField
                            label="Name"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </form>
                </ProfileCard>

            }

        </>
    )
}

export default ProfileSettings;
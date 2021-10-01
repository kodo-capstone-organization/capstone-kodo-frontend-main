import { Account } from "../../../apis/Entities/Account";
import { Button } from "../../../values/ButtonElements";
import { updateAccountPassword } from '../../../apis/Account/AccountApis';
import {
    IconButton,
    Input, 
    InputLabel,
    InputAdornment, 
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useEffect, useState } from 'react';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

interface IErrors<TValue> {
    [id: string]: TValue;
}

function ChangePasswordModal(props: any) {
    const [open, setOpen] = React.useState(false);
    const [myAccount, setMyAccount] = useState<Account>()
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [showOldPassword, setShowOldPassword] = useState<Boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<Boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<Boolean>(false);

    const [updateAccountPasswordFailed, setUpdateAccountPasswordFailed] = useState<String>("");
    const [updateAccountPasswordSuccess, setUpdateAccountPasswordSuccess] = useState<String>("");

    var [errors, setErrors] = useState<IErrors<any>>({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        setMyAccount(props.account)
    }, [props.account])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setErrors({});
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setUpdateAccountPasswordFailed("");
        setUpdateAccountPasswordSuccess("");
        setOpen(false);
    };

    const handleClickShowOldPassword = () => {
        setShowOldPassword(!showOldPassword)
    };

    const handleMouseDownOldPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleClickShowNewPassword = () => {
        setShowNewPassword(!showNewPassword)
    };

    const handleMouseDownNewPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
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

        // Old Password
        if (oldPassword === "") {
            formIsValid = false;
            errors["oldPassword"] = true;
        }

        // New Password
        if (newPassword === "") {
            formIsValid = false;
            errors["newPassword"] = true;
        }

        // Confirm Password
        if (confirmPassword === "") {
            formIsValid = false;
            errors["confirmPassword"] = true;
        }

        setErrors(errors);
        return formIsValid;
    }

    const handleAction = () => {
        if (myAccount !== undefined && handleValidation()) {
            if (newPassword === confirmPassword)
            {
                const updateAccountPasswordReq = {
                    accountId: myAccount.accountId,
                    username: myAccount.username,
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }

                updateAccountPassword(updateAccountPasswordReq)
                    .then((res) => {
                        props.callOpenSnackBar("Password successfully changed", "success");
                        setUpdateAccountPasswordSuccess("Password Successfully Changed");
                        handleClose();
                    })
                    .catch((err) => {
                        setUpdateAccountPasswordFailed(err.response.data.message);
                    });
            }   
            else
            {
                setUpdateAccountPasswordFailed("New Password and confirmation does not match");
            }         
        }
    };

    const showSuccess = () => {
        if (updateAccountPasswordSuccess)
        {
            return(<Alert severity="success">{updateAccountPasswordSuccess}</Alert>);
        }
        else
        {
            return "";
        }
    }

    const showErrors = () => {
        if (updateAccountPasswordFailed)
        {
            return(<Alert severity="error">{updateAccountPasswordFailed}</Alert>);
        }
        else
        {
            return "";
        }
    }

    return (
        <>
            <div>
                <Button style={{ width: "fit-content", margin: "20px auto 10px auto" }} onClick={handleOpen}>Change Password</Button>
                <Dialog fullWidth open={open} onClose={handleClose}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <DialogTitle id="form-dialog-title">Change Your Password</DialogTitle>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <DialogContent>
                        <InputLabel
                            style={{
                                color: "rgba(0, 0, 0, 0.54)",
                                padding: "0",
                                fontSize: "0.75rem",
                                lineHeight: "1",
                                letterSpacing: "0.00938em"
                            }}
                            htmlFor="standard-adornment-old-password">Old Password</InputLabel>
                        <Input
                            autoComplete="off"
                            error={errors["oldPassword"]}
                            id="standard-adornment-old-password"
                            type={showOldPassword ? 'text' : 'password'}
                            value={oldPassword}
                            style={{ margin: "0 0 10px 0", width: "100%" }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setOldPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowOldPassword}
                                        onMouseDown={handleMouseDownOldPassword}
                                    >
                                        {showOldPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <br/>
                        <InputLabel
                            style={{
                                color: "rgba(0, 0, 0, 0.54)",
                                padding: "0",
                                fontSize: "0.75rem",
                                lineHeight: "1",
                                letterSpacing: "0.00938em"
                            }}
                            htmlFor="standard-adornment-new-password">New Password</InputLabel>
                        <Input
                            autoComplete="off"
                            error={errors["newPassword"]}
                            id="standard-adornment-new-password"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            style={{ margin: "0 0 10px 0", width: "100%" }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNewPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowNewPassword}
                                        onMouseDown={handleMouseDownNewPassword}
                                    >
                                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <br/>
                        <InputLabel
                            style={{
                                color: "rgba(0, 0, 0, 0.54)",
                                padding: "0",
                                fontSize: "0.75rem",
                                lineHeight: "1",
                                letterSpacing: "0.00938em"
                            }}
                            htmlFor="standard-adornment-confirm-password">Confirm New Password</InputLabel>
                        <Input
                            autoComplete="off"
                            error={errors["confirmPassword"]}
                            id="standard-adornment-confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            style={{ margin: "0 0 10px 0", width: "100%" }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setConfirmPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowConfirmPassword}
                                        onMouseDown={handleMouseDownConfirmPassword}
                                    >
                                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        { showErrors() }
                        { showSuccess() }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAction} primary>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
}

export default ChangePasswordModal;
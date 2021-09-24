import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Button } from "../../../values/ButtonElements";
import { Account } from "../../../apis/Entities/Account";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ProfileSettingField } from "../ProfileElements";

interface IErrors<TValue> {
    [id: string]: TValue;
}

function ChangePasswordModal(props: any) {
    const [open, setOpen] = React.useState(false);
    const [myAccount, setMyAccount] = useState<Account>()
    const [oldPassword, setOldPassword] = useState<string>("");
    var [errors, setErrors] = useState<IErrors<any>>({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const history = useHistory();

    useEffect(() => {
        setMyAccount(props.account)
    }, [props.account])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAction = () => {
        if (myAccount !== undefined) {
            // deactivateAccount(myAccount.accountId, myAccount.accountId)
            //     .then((res) => {
            //          console.log(res);
            //          window.sessionStorage.removeItem("loggedInAccountId");
            //          window.sessionStorage.removeItem("loggedInAccountUsername");
            //          window.sessionStorage.removeItem("loggedInAccountPassword");
            //          history.push("/")
            //      })
            //     .catch(error => console.log("error in deactivating", error));
        }
    };

    return (
        <>
            <div>
                <Button style={{ width: "fit-content", margin: "20px auto 10px auto" }} onClick={handleOpen}>Change Password</Button>
                <Dialog open={open} onClose={handleClose}>
                    <div style={{ display: "flex" }}>
                        <DialogTitle id="form-dialog-title">Change Your Password</DialogTitle>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <DialogContent>
                        <ProfileSettingField 
                            error={errors["oldPassword"]} 
                            style={{ margin: "0 0 10px 0" }} 
                            label="oldPassword" 
                            value={oldPassword} 
                            // onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName(e.target.value)} 
                        />
                        <DialogContentText>
                            New Password: 
                        </DialogContentText>
                        <DialogContentText>
                            Confirm Password: 
                        </DialogContentText>
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
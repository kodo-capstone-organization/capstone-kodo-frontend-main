import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Button } from "../../../values/ButtonElements";
import { Account } from "../../../apis/Entities/Account";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Chip } from '@material-ui/core';
import { deactivateAccount } from '../../../apis/Account/AccountApis';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
        // closeButton: {
        //     position: 'absolute',
        //     right: theme.spacing(1),
        //     top: theme.spacing(1),
        //     color: theme.palette.grey[500],
        // },
    }),
);


function DeactivateAccountModal(props: any) {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [myAccount, setMyAccount] = useState<Account>()
    const [isActive, setIsActive] = useState<Boolean>()

    useEffect(() => {
        setMyAccount(props.account)
        if (props.account !== undefined) {
            setIsActive(props.account.isActive)

        }
    }, [props.account])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAction = () => {
        if (myAccount !== undefined) {
            deactivateAccount(myAccount.accountId, myAccount.accountId)
                .then((res) => { console.log(res); window.location.reload(); })
                .catch(error => console.log("error in deactivating", error));
        }

    };

    return (
        <>
            <div>
                <Button big style={{ width: "fit-content", margin: "20px auto 10px auto" }} onClick={handleOpen}>{isActive ? "Deactivate" : "Activate"} Account</Button>
                <Dialog open={open} onClose={handleClose}>
                    <div style={{ display: "flex" }}>
                        <DialogTitle id="form-dialog-title">Deactivate/Reactivate Your Kodo Account</DialogTitle>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <DialogContent>
                        <DialogContentText>
                            Account Status: <Chip variant="outlined" label={isActive ? "Activated" : "Deactivated"} style={{ color: isActive ? "green" : "red", border: isActive ? "1px solid green" : "1px solid red" }} />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAction} primary>
                            {isActive ? "Deactivate" : "Activate"} My Account
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
}

export default DeactivateAccountModal;
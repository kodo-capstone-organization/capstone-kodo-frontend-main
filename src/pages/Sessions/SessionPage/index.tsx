import React, {useState} from 'react'
import { SessionPageContainer, SessionPageBreadcrumbs, SessionPageDescription, SessionPageCreateOrJoinContainer, SessionPageTypography, SessionPageInvitedSessions } from './SessionPageElements';
import { Link, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import MUIButton from '@material-ui/core/Button';
import { Button } from '../../../values/ButtonElements';
import TextField from '@material-ui/core/TextField';
import PermPhoneMsgIcon from '@material-ui/icons/PermPhoneMsg';

function SessionPage(props: any) {

    const [showJoinButton, setShowJoinButton] = useState<boolean>(false);
    const [inputSessionID, setInputSessionID] = useState<string>("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

    const handleSessionIDChange = (event: any) => {
        setShowJoinButton(true);
        // TODO: Link Handling
        setInputSessionID(event?.target?.value);
    }

    const handleOpenCreateDialog = () => {
        setIsCreateDialogOpen(true)
    }

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false)
    }

    return (
        <>
            <SessionPageContainer>
                <SessionPageBreadcrumbs aria-label="sessions-breadcrumb">
                    <Link color="primary" href="/session">Sessions</Link>
                </SessionPageBreadcrumbs>
                <SessionPageDescription>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </SessionPageDescription>
                <SessionPageCreateOrJoinContainer>
                    <SessionPageTypography variant="h6">Create or Join a Kodo Session</SessionPageTypography>
                    <Grid container spacing={3} alignItems="stretch">
                        <Grid item xs={8} md={8} lg={3}>
                            <Button onClick={handleOpenCreateDialog} primary fontBig big style={{ height: "1.75rem", fontSize: "16px"}}>
                                <PermPhoneMsgIcon/> &nbsp;&nbsp; New Session
                            </Button>
                        </Grid>
                        <Grid item xs={8} md={8} lg={5}>
                            <TextField
                                id="session-id-input"
                                label="Enter Session ID or Join Link"
                                variant="outlined"
                                fullWidth
                                size="medium"
                                autoComplete="off"
                                onChange={handleSessionIDChange}
                                onFocus={() => setShowJoinButton(true)}
                                onBlur={() => setShowJoinButton(!!inputSessionID) /* set to false only if inputSessionID is empty */}
                            />
                        </Grid>
                        { showJoinButton &&
                            <Grid item xs={4} md={4} lg={2} style={{ alignSelf: "center" }}>
                                <MUIButton color="primary" disabled={inputSessionID === ""} style={{ fontSize: "18px", textTransform: "none"}}>
                                    Join
                                </MUIButton>
                            </Grid>
                        }
                    </Grid>
                </SessionPageCreateOrJoinContainer>
                <SessionPageInvitedSessions>
                    <SessionPageTypography variant="h6">My Invited Sessions</SessionPageTypography>
                    <SessionPageDescription>
                       To be confirmed
                    </SessionPageDescription>
                </SessionPageInvitedSessions>
            </SessionPageContainer>

            {/* Create new session dialog */}
            <Dialog id="create-session-dialog" fullWidth open={isCreateDialogOpen} onClose={handleCloseCreateDialog}>
                <DialogTitle id="create-session-dialog-title">Create A Kodo Session</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        TBD
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button primary>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SessionPage
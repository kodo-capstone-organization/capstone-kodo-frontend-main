import React, {useEffect, useReducer, useState} from 'react'
import { SessionPageContainer, SessionPageBreadcrumbs, SessionPageDescription, SessionPageCreateOrJoinContainer, SessionPageTypography, SessionPageInvitedSessions } from './SessionPageElements';
import { Link, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, Input, Checkbox, FormControlLabel, Chip, Avatar, Box, FormHelperText, Card, CardContent, Typography, CardActions } from '@material-ui/core';
import MUIButton from '@material-ui/core/Button';
import { Button } from '../../../values/ButtonElements';
import TextField from '@material-ui/core/TextField';
import PermPhoneMsgIcon from '@material-ui/icons/PermPhoneMsg';
import { createSession, getInvitedSessions } from '../../../apis/Session/SessionApis';
import { Account, StrippedDownAccount } from '../../../apis/Entities/Account';
import {getAllAccountsStrippedDown, getMyAccount } from '../../../apis/Account/AccountApis';
import { Autocomplete } from '@material-ui/lab';
import KodoAvatar from '../../../components/KodoAvatar/KodoAvatar';
import { colours } from '../../../values/Colours';
import { CreateSessionReq, InvitedSessionResp } from '../../../apis/Entities/Session';
import { BlankStateContainer } from '../../MyProfilePage/ProfileElements';

const formReducer = (state: any, event: any) => {
    if(event.reset) {
        if (event.isErrorForm) {
            return {
                sessionName: '',
                isPublic: '',
                creatorId: '',
                inviteeList: ''
            }
        } else {
            return {
                sessionName: '',
                isPublic: false,
                creatorId: null,
                inviteeList: []
            }
        }
    }

    return {
        ...state,
        [event.name]: event.value
    }
}

function SessionPage(props: any) {

    const accountId = parseInt(window.sessionStorage.getItem("loggedInAccountId") || "");
    const [myAccount, setMyAccount] = useState<Account>();
    const [myInvitedSessions, setMyInvitedSessions] = useState<InvitedSessionResp[]>([]);
    const [showJoinButton, setShowJoinButton] = useState<boolean>(false);
    const [inputSessionID, setInputSessionID] = useState<string>("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

    // CreateSession form states
    const [createSessionForm, setCreateSessionForm] = useReducer(formReducer, {})
    const [createSessionFormErrors, setCreateSessionFormErrors] = useReducer(formReducer, {});
    const [userLibrary, setUserLibrary] = useState<StrippedDownAccount[]>([]);
    
    useEffect(() => {
        // Get current account
        getMyAccount(accountId).then(receivedAccount => {
            setMyAccount(receivedAccount);
        });

        // Get invited sessions
        getInvitedSessions(accountId).then((receivedSessions: InvitedSessionResp[]) => {
            setMyInvitedSessions(receivedSessions)
        });
        
        // Get userlibrary
        getAllAccountsStrippedDown().then((accs: StrippedDownAccount[]) => {
            // Remove own obj
            accs = accs.filter((acc: StrippedDownAccount) => acc.accountId !== accountId)
            setUserLibrary(accs);
        })

        // Reset forms
        setCreateSessionForm({ reset: true, isErrorForm: false })
        setCreateSessionFormErrors({ reset: true, isErrorForm: true })
    }, [])

    useEffect(() => {

        // If isPublic set to true, clear inviteeList
        if (createSessionForm.isPublic) {
            handleFormDataChange({
                target: {
                    name: "inviteeList",
                    value: []
                }
            })
        }

    }, [createSessionForm.isPublic])

    const getUsernameById = (id: number): string => {
        const foundUser = userLibrary.find(userObj => userObj.accountId === id)
        return foundUser?.username || "";
    }

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

    const handleCheckedInputChange = (event: any) => {

        let wrapperEvent = {
            target: {
                name: "isPublic",
                value: event.target.checked
            }
        }
        return handleFormDataChange(wrapperEvent);
    }

    const handleChipInputChange = (e: object, value: StrippedDownAccount[], reason: string) => {
        let wrapperEvent = {
            target: {
                name: "inviteeList",
                value: value
            }
        }
        return handleFormDataChange(wrapperEvent);
    }

    const handleFormDataChange = (event: any) => {
        // Clear any existing errors on target field

        if (event.target.name === "isPublic" || event.target.name === "inviteeList") {
            handleFormErrorChange({ target: { name: "isPublic" , value: "" }})
            handleFormErrorChange({ target: { name: "inviteeList" , value: "" }})
        } else {
            handleFormErrorChange({ target: { name: event.target.name , value: "" }})
        }
        
        // Set to create form
        setCreateSessionForm({
            name: event.target.name,
            value: event.target.value,
        });
    }

    const handleFormErrorChange = (event: any) => {
        setCreateSessionFormErrors({
            name: event.target.name,
            value: event.target.value,
        });
    }

    const handleCreateSessionValidation = () => {
        let formIsValid = true

        if (createSessionForm.sessionName === "") {
            formIsValid = false
            handleFormErrorChange({ target: { name: "sessionName", value: "Session Name cannot be empty" }})
        }

        // When NOT public but inviteeList is empty
        if (!createSessionForm.isPublic && createSessionForm.inviteeList.length === 0) {
            formIsValid = false
            handleFormErrorChange({ target: { name: "isPublic", value: "Session has to either be public or specifies at least one invitee" }})
            handleFormErrorChange({ target: { name: "inviteeList", value: "Session has to either be public or specifies at least one invitee" }})
        }

        // Check if form is still valid
        if (formIsValid) {
            handleCreateSession()
        }
    }

    const handleCreateSession = () => {

        // Build CreateSessionReq
        let createSessionReq = {} as CreateSessionReq;
        createSessionReq.creatorId = accountId;
        createSessionReq.sessionName = createSessionForm.sessionName;
        createSessionReq.isPublic = createSessionForm.isPublic;
        if (createSessionReq.isPublic) {
            createSessionReq.inviteeIds = []
        } else {
            // Change inviteeList to inviteeIds number[]
            createSessionReq.inviteeIds = createSessionForm.inviteeList.map((userObj: StrippedDownAccount) => userObj.accountId)
        }

        console.log("Built: ", createSessionReq);

        // Make API Call
        createSession(createSessionReq).then((sessionId: string) => {
            // Display success and redirect
            props.callOpenSnackBar("Session created successfully", "success")
            props.history.push({ pathname: `/session/create/${sessionId}`, state: { sessionName: createSessionReq.sessionName } })
        }).catch((error) => {
            props.callOpenSnackBar(`Error in creating session: ${error}`, "error")
        })
    }

    const handleJoinSession = (sessionId: string, sessionName?: string) => {
        if (sessionId) {
            props.history.push({ pathname: `/session/join/${sessionId}`, state: { sessionName: sessionName || "" } })
            props.callOpenSnackBar("Session joined successfully", "success")
        }
    }

    return (
        <>
            <SessionPageContainer>
                <SessionPageBreadcrumbs aria-label="sessions-breadcrumb">
                    <Link color="primary" href="/session">Sessions</Link>
                </SessionPageBreadcrumbs>
                <SessionPageDescription>
                    Trying to discuss a new algorithm or run through a challenging problem with another Koder? Kodo sessions allows for ad-hoc collaboration with tools like whiteboard and code editor over a real-time audio call. Start a new Kodo session and invite other Koders along!
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

                    { myInvitedSessions.length === 0 &&
                        <SessionPageDescription>
                            No invited sessions to be found 🔍
                        </SessionPageDescription>
                    }

                    { myInvitedSessions.length > 0 &&
                        <>
                            <SessionPageDescription>
                                These sessions are happening right now!
                            </SessionPageDescription>
                            <br/>
                            <Grid container spacing={3}>
                                { // TODO: Cleanup & Beautify
                                    myInvitedSessions
                                        .map((invitedSession: InvitedSessionResp) => (
                                            <Grid item xs={4} key={invitedSession.sessionId}>
                                                <Card style={{ flexWrap: "wrap", wordWrap: "break-word"}}>
                                                    <CardContent>
                                                        <Typography variant="h5">
                                                            {invitedSession.sessionName}
                                                        </Typography>
                                                        <Typography color="textSecondary">
                                                            <strong>Host: </strong><i>@{getUsernameById(invitedSession.hostId)}</i>
                                                        </Typography>
                                                        <Typography color="textSecondary">
                                                            <strong>Session ID: </strong>{invitedSession.sessionId}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions style={{ display: "flex", justifyContent: "flex-end"}}>
                                                        <Button onClick={() => handleJoinSession(invitedSession.sessionId, invitedSession.sessionName)}>Join Session</Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        ))
                                }
                            </Grid>
                        </>
                    }
                </SessionPageInvitedSessions>
            </SessionPageContainer>

            {/* Create new session dialog */}
            <Dialog id="create-session-dialog" fullWidth open={isCreateDialogOpen} onClose={handleCloseCreateDialog}>
                <DialogTitle id="create-session-dialog-title">Create A Kodo Session</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Give your session a name!
                    </DialogContentText>

                    <FormControl fullWidth>
                        <InputLabel htmlFor="session-name">Session Name</InputLabel>
                        <Input
                            id="session-name"
                            name="sessionName"
                            error={createSessionFormErrors.sessionName}
                            placeholder={createSessionFormErrors.sessionName}
                            value={createSessionForm.sessionName}
                            onChange={handleFormDataChange}
                            type="text"
                            autoFocus
                        />
                    </FormControl>

                    <DialogContentText>
                        <br/>
                        <br/>
                        Allow anyone to join your session OR specify who you'd like to invite ✍️
                    </DialogContentText>

                    <FormControl fullWidth error={createSessionFormErrors.isPublic || createSessionFormErrors.inviteeList }>
                        <FormControlLabel
                            style={{ color: colours.GRAY3 }}
                            label="Anyone can join this session"
                            control={
                                <Checkbox
                                    name="isPublic"
                                    checked={createSessionForm.isPublic}
                                    onChange={handleCheckedInputChange}
                                    color="primary"
                                />
                            }
                        />

                        <Autocomplete
                            multiple
                            options={userLibrary}
                            getOptionLabel={(option) => option.username}
                            defaultValue={[]}
                            value={createSessionForm.inviteeList}
                            noOptionsText="No user found"
                            onChange={handleChipInputChange}
                            renderOption={(userObj, props) => (
                                <Box {...props}>
                                    <img width="30" src={userObj.displayPictureUrl || ""} alt={userObj.name}/>
                                    &nbsp;&nbsp;&nbsp;
                                    {userObj.name} · <i>@{userObj.username}</i>
                                </Box>
                            )}
                            renderTags={(values: StrippedDownAccount[], getTagProps) =>
                                values.map((userObj: StrippedDownAccount, index: number) => (
                                    <Chip
                                        variant="outlined"
                                        label={<i>@{userObj?.username}</i>}
                                        avatar={<Avatar alt={userObj.name} src={userObj.displayPictureUrl || ""} />}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Invitees"
                                    inputProps={{
                                        ...params.inputProps
                                    }}
                                />
                            )}
                            disabled={createSessionForm.isPublic}
                        />

                        <FormHelperText>{createSessionFormErrors.isPublic}</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth>

                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button primary onClick={handleCreateSessionValidation}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SessionPage

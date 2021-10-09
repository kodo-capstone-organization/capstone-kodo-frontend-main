import React from 'react'
import { useHistory } from "react-router";
import { ActionsPanelContainer, ActionItem } from '../LiveKodoSessionPageElements';
import { Grid, IconButton } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

function ActionsPanel(props: any) {

    const history = useHistory();

    const copyJoinLinkToClipboard = () => {
        const prefix = `${window.location.protocol}//${window.location.host}`;
        const joinUrl = `${prefix}/session/join/${props.sessionId}`
        navigator.clipboard.writeText(joinUrl)
        props.callOpenSnackBar("Join Link Copied!", "info")
    }

    const navigateToSessionPage = () => {
        history.push(`/session`)
    }

    return (
        <ActionsPanelContainer>
            <strong>Actions</strong>
            <br/>
            <ActionItem>
                <IconButton aria-label="copy-join-link" color="primary" onClick={copyJoinLinkToClipboard}>
                    <FileCopyIcon />
                </IconButton>
                <span style={{ textAlign: "center", color: "blue" }}>Copy Join Link</span>
            </ActionItem>
            <ActionItem>
                <IconButton aria-label="exit-to-session-page" color="secondary" onClick={navigateToSessionPage}>
                    <ExitToAppIcon/>
                </IconButton>
                <span style={{ textAlign: "center", color: "red" }}>Exit</span>
            </ActionItem>
        </ActionsPanelContainer>
    )
}

export default ActionsPanel;
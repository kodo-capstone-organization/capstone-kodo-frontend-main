import React from 'react'
import { ActionsPanelContainer, ActionItem } from '../LiveKodoSessionPageElements';
import { IconButton } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

function ActionsPanel(props: any) {

    const copyJoinLinkToClipboard = () => {
        const prefix = `${window.location.protocol}//${window.location.host}`;
        const joinUrl = `${prefix}/session/join/${props.sessionId}`
        navigator.clipboard.writeText(joinUrl)
        props.callOpenSnackBar("Join Link Copied!", "info")
    }

    const navigateToSessionPage = () => {
        props.handleMyExit(); // call parent exit method
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
import React, { useState }from 'react'
import { ActionsPanelContainer, ActionItem } from '../LiveKodoSessionPageElements';
import { IconButton } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

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

    const handleMuteToggle = () => {
        props.handleMyMuteToggle(); // call parent toggle method
    }

    return (
        <ActionsPanelContainer>
            <strong>Actions</strong>
            <br/>
            <ActionItem id="copy-action">
                <IconButton aria-label="copy-join-link" color="primary" onClick={copyJoinLinkToClipboard}>
                    <FileCopyIcon />
                </IconButton>
                <span style={{ textAlign: "center", color: "blue" }}>Copy Join Link</span>
            </ActionItem>
            <ActionItem id="mute-unmute-action">
                <IconButton aria-label="mute-unmute"  color="primary" onClick={handleMuteToggle}>
                    {props.amIMuted ? <MicOffIcon /> : <MicIcon/>}
                </IconButton>
                <span style={{ textAlign: "center", color: "blue" }}>{props.amIMuted ? "Unmute" : "Mute"}</span>
            </ActionItem>
            <ActionItem id="exit-action">
                <IconButton aria-label="exit-to-session-page" color="secondary" onClick={navigateToSessionPage}>
                    <ExitToAppIcon/>
                </IconButton>
                <span style={{ textAlign: "center", color: "red" }}>Exit</span>
            </ActionItem>
        </ActionsPanelContainer>
    )
}

export default ActionsPanel;
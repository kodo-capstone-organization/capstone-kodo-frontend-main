import { Grid, IconButton } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { ActionsPanelContainer, ActionItem } from '../LiveKodoSessionPageElements';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { formatUrl } from '../../../../apis/HttpClient/UrlFormatter';

function ActionsPanel(props: any) {

    const copyJoinLinkToClipboard = () => {
        const prefix = `${window.location.protocol}//${window.location.host}`;
        const joinUrl = `${prefix}/session/join/${props.sessionId}`
        navigator.clipboard.writeText(joinUrl)
        props.callOpenSnackBar("Join Link Copied!", "info")
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
        </ActionsPanelContainer>
    )
}

export default ActionsPanel;
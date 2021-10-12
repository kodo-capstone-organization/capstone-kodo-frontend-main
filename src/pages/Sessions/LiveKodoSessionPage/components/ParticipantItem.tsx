import React from 'react'
import { Badge, Tooltip } from "@material-ui/core";
import KodoAvatar from "../../../../components/KodoAvatar/KodoAvatar";
import { fontSizes } from "../../../../values/FontSizes";
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

function ParticipantItem (props: any) {

    return (
        <>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={ props.isMuted ? <MicOffIcon color="secondary" /> : <MicIcon color="primary" /> }
            >
                <KodoAvatar small="true" showRing={props.isSpeaking} name={props.participant.name} displayPictureURL={props.participant.displayPictureUrl}/>
            </Badge>
            <br/>
            <Tooltip title={<i>@{props.participant.username}</i>} placement="right" arrow>
                <div style={{ textAlign: "center", fontSize: fontSizes.SUBTEXT, paddingTop: "0.5rem"  }}>
                   {props.participant.name}
                </div>
            </Tooltip>
        </>
    )
    
}

export default ParticipantItem;
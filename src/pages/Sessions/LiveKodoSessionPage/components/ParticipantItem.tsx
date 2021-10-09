import {useEffect, useState } from "react";
import { Badge } from "@material-ui/core";
import { StrippedDownAccount } from "../../../../apis/Entities/Account";
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
                <KodoAvatar small="true" name={props.participant.name} displayPictureURL={props.participant.displayPictureUrl}/>
            </Badge>
            <br/>
            <span style={{ fontSize: fontSizes.SUBTEXT }}>{props.participant.name}</span>
        </>
    )
    
}

export default ParticipantItem;
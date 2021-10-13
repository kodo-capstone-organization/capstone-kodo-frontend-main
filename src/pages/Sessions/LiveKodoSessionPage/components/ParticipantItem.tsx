import React, {useState, useEffect} from 'react'
import { Badge, Tooltip } from "@material-ui/core";
import KodoAvatar from "../../../../components/KodoAvatar/KodoAvatar";
import { fontSizes } from "../../../../values/FontSizes";
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { SoundProcessor } from '../../../../utils/SoundProcessor';

let peerInterval: NodeJS.Timer;
let myInterval: NodeJS.Timer;

function ParticipantItem (props: any) {

    const audioContext = new AudioContext();
    const soundProcessor = new SoundProcessor(audioContext);
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

    useEffect(() => {
        // If this participant is a remote peer
        if (props.receiver !== null) {
            peerInterval = setInterval(() => {
                const [ssrc] = props.receiver.getSynchronizationSources()
                if (ssrc) {
                    console.log("PEER STREAM", ssrc.audioLevel);
                    setIsSpeaking(ssrc.audioLevel > 0.003); // Speaking threshold
                }
            }, 500) // Every 0.5 seconds
        }

        return () => {
            clearInterval(peerInterval)
        }
    }, [props.receiver])

    useEffect(() => {
        // If this participant is the current user
        if (props.myLocalStream !== null && props.myLocalStream !== undefined) {
            soundProcessor.connectToSource(props.myLocalStream, function(e: any) {
                if (e) {
                    console.error("error in soundProcessor.connectToSource", e)
                    return;
                }
                myInterval = setInterval(() => {
                    const currentNumba = parseFloat(soundProcessor.instant.toFixed(2));
                    console.log("MY LOCAL STREAM", currentNumba)
                    setIsSpeaking(currentNumba > 0.003);
                }, 500);
            });
        }

        //
        return () => {
            clearInterval(myInterval)
            soundProcessor.stop()
        }

    }, [props.myLocalStream])

    return (
        <>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={ props.isMuted ? <MicOffIcon color="secondary" /> : <MicIcon color="primary" /> }
            >
                <KodoAvatar small="true" showRing={isSpeaking} name={props.participant.name} displayPictureURL={props.participant.displayPictureUrl}/>
            </Badge>
            <br/>
            <Tooltip title={<i>@{props.participant.username}</i>} placement="right" arrow>
                <div style={{ textAlign: "center", fontSize: fontSizes.SUBTEXT }}>
                   {props.participant.name}
                </div>
            </Tooltip>
        </>
    )
    
}

export default ParticipantItem;
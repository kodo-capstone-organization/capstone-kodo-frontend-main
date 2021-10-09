import React, { useEffect, useState } from 'react'
import { getSomeAccountsStrippedDown } from '../../../../apis/Account/AccountApis';
import { ParticipantsPanelContainer } from '../LiveKodoSessionPageElements';
import { StrippedDownAccount } from '../../../../apis/Entities/Account';
import ParticipantItem from './ParticipantItem';
import { Grid } from '@material-ui/core';

function ParticipantsPanel(props: any) {
    
    const [participants, setParticipants] = useState<StrippedDownAccount[]>([]);

    useEffect(() => {
        let ids: number[] = Array.from(props.peerConns.keys());
        ids.unshift(props.myAccountId); // append my own id to the start of the array
        getSomeAccountsStrippedDown(ids).then((accs: StrippedDownAccount[]) => {
            setParticipants(accs)
        })
    }, [props.peerConns.size, props.myAccountId])
    
    const isParticipantSpeaking = (accountId: number) => {
        
        if (isParticipantMuted(accountId)) {
            return false;
        }
        
        if (accountId === props.myAccountId) {
            return amISpeaking();
        } else {
            return isPeerSpeaking(accountId)
        }
    }  
    
    const amISpeaking = () => {
        // TODO: Check local stream
        return false;
    }
    
    const isPeerSpeaking = (participantId: number) => {
        // TODO: Search through peerConns and check their audio stream
        return false;
    }

    const isParticipantMuted = (accountId: number) => {
        // TODO: Search through peerConns and see if their audio stream is even there?
        return false
    }

    return (
        <ParticipantsPanelContainer>
            <strong>Participants</strong>
            <br/>
            <Grid container direction="column" spacing={2} style={{ alignItems: "center"}}>
                { participants.map((participant: StrippedDownAccount) => (
                    <Grid item key={participant.accountId} >
                        <ParticipantItem participant={participant} isMuted={isParticipantMuted(participant.accountId)} isSpeaking={isParticipantSpeaking(participant.accountId)}/>
                    </Grid>
                ))}
            </Grid>
        </ParticipantsPanelContainer>
    )
}

export default ParticipantsPanel;
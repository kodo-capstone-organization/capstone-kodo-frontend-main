import React, { useEffect, useState } from 'react'
import { getSomeAccountsStrippedDown } from '../../../../apis/AccountApis';
import { ParticipantsPanelContainer } from '../LiveKodoSessionPageElements';
import { StrippedDownAccount } from '../../../../entities/Account';
import ParticipantItem from './ParticipantItem';
import { Grid } from '@material-ui/core';

function ParticipantsPanel(props: any) {

    const [peerConns, setPeerConns] = useState(props.peerConns)
    const [participants, setParticipants] = useState<StrippedDownAccount[]>([]);

    useEffect(() => {
        let ids: number[] = Array.from(peerConns.keys());
        ids.unshift(props.myAccountId); // append my own id to the start of the array
        getSomeAccountsStrippedDown(ids).then((accs: StrippedDownAccount[]) => {
            setParticipants(accs)
        })
    }, [peerConns.size, props.myAccountId])

    const isParticipantMuted = (accountId: number) => {
        return accountId === props.myAccountId ? props.amIMuted : peerConns.get(accountId)?.isMuted
    }
    
    const getParticipantReceiver = (accountId: number) => {
        if (accountId === props.myAccountId) {
            return null;
        } else {
            return peerConns?.get(accountId)?.rtcPeerConnection?.getReceivers()[0] || null;
        }
    }
    
    const getMyLocalStream = (accountId: number) => {
        if (accountId === props.myAccountId) {
            return props.myLocalStream;
        } else {
            return null;
        }
    }

    return (
        <ParticipantsPanelContainer>
            <strong>Participants</strong>
            <br/>
            <Grid container direction="column" spacing={2} style={{ alignItems: "center"}}>
                { participants.map((participant: StrippedDownAccount, index: number) => (
                    <Grid item key={index} >
                        <ParticipantItem
                            key={participant.accountId}
                            participant={participant}
                            isMuted={isParticipantMuted(participant.accountId)}
                            receiver={getParticipantReceiver(participant.accountId)}
                            myLocalStream={getMyLocalStream(participant.accountId)}
                        />
                    </Grid>
                ))}
            </Grid>
        </ParticipantsPanelContainer>
    )
}

export default ParticipantsPanel;
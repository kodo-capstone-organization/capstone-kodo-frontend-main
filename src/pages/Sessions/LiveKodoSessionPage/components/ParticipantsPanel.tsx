import React, { useEffect, useState } from 'react'
import { getAllAccountsStrippedDown } from '../../../../apis/Account/AccountApis';
import { ParticipantsPanelContainer } from '../LiveKodoSessionPageElements';
import { StrippedDownAccount } from '../../../../apis/Entities/Account';

function ParticipantsPanel(props: any) {
    const [participants, setParticipants] = useState<string[]>([]);

    useEffect(() => {
        getAllAccountsStrippedDown().then((accs: StrippedDownAccount[]) => {
            const participantNames = accs
            .filter((acc: StrippedDownAccount) => props.participantIds.includes(acc.accountId))
            .map((acc: StrippedDownAccount) => acc.name)

            setParticipants(participantNames)
        })
    }, [props.participantIds])

    return (
        <ParticipantsPanelContainer>
            {participants.map((participant: string) => {
                return <strong>{participant}</strong>
            })}
        </ParticipantsPanelContainer>
    )
}

export default ParticipantsPanel;
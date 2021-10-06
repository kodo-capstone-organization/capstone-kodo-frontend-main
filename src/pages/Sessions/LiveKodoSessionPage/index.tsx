import React, { useEffect, useState } from 'react'
import ActionsPanel from './components/ActionsPanel';
import ParticipantsPanel from './components/ParticipantsPanel';
import Stage from './components/Stage';
import { LiveKodoSessionContainer, MainSessionWrapper, TopSessionBar } from './LiveKodoSessionPageElements';

// URL: /session/<CREATE_OR_JOIN>/<SESSION_ID>
// To consider: Adding ?pwd=<PASSWORD> as a query param
function LiveKodoSessionPage(props: any) {
    
    const [initAction, setInitAction] = useState<string>(); // "create" or "join" only
    const [sessionId, setSessionId] = useState<string>();

    useEffect(() => {
        if (props.match.params.initAction.toLowerCase() === "create" || props.match.params.initAction.toLowerCase() === "join") {
            setInitAction(props.match.params.initAction.toLowerCase())
            setSessionId(props.match.params.sessionId)
        } else {
            props.history.push('/invalidsession') // redirects to 404 (for now)
        }
    }, [props.match.params])

    // If "create", initialise a new active session

    // If "join", it is a peer joining into an active session

    return (
        <LiveKodoSessionContainer>
            <TopSessionBar><strong>Session_Name ({sessionId}) · Time_Elapsed</strong></TopSessionBar>
            <MainSessionWrapper> 
                <ParticipantsPanel />
                <Stage />
                <ActionsPanel />
            </MainSessionWrapper>
        </LiveKodoSessionContainer>
    )
}

export default LiveKodoSessionPage;
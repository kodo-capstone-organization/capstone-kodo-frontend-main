import { useEffect, useState } from "react";
import { StageContainer } from "../LiveKodoSessionPageElements";

function Stage(props: any) {

    const [peerConns, setPeerConns] = useState<Map<number, any>>(new Map());

    useEffect(() => {
        setPeerConns(props.peerConns)
    }, [props.peerConns.size])

    return (
        <StageContainer>
            stage
            <br/>
            peerConns keys: { Array.from(peerConns.keys()).join(", ") }
            <br/>
            dataChannelStatus: {props.dataChannelConnected? "connected" : "not connected"}
            <br/>
        </StageContainer>
    )
}

export default Stage;
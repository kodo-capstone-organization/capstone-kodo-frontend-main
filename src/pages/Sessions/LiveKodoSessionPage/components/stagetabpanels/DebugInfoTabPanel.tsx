import { Button } from "@material-ui/core";
import { DebugInfoPanelWrapper } from "./StageTabPanelsElements";

function DebugInfoTabPanel (props: any) {

    return (
        <DebugInfoPanelWrapper>
            <strong>Debug Info Panel (To be removed in FSR) </strong>
            <li>peerConns keys: { props.peerConnsKeys }</li>
            <li>initial data channel status: {props.dataChannelConnected? "connected" : "not connected"}</li>

            <br/>
            <strong>Debug Actions</strong>
            <li><Button size="small" variant="outlined" color="primary" onClick={() => props.sendViaWSCallback({event: null, data: "helloWord"})}>Send Via Websocket</Button></li>
            <li><Button size="small" variant="outlined" color="primary" onClick={() => props.sendCallEventViaDCCallback(`hello from ${props.myAccountId}`)}>SEND VIA DATACHANNEL</Button></li>
        </DebugInfoPanelWrapper>
    )
}

export default DebugInfoTabPanel;
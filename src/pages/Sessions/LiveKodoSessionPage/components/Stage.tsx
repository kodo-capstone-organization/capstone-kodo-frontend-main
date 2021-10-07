import { StageContainer } from "../LiveKodoSessionPageElements";

function Stage(props: any) {

    return (
        <StageContainer>
            stage
            <br/>
            dataChannelStatus: {props.dataChannelConnected? "connected" : "not connected"}
        </StageContainer>
    )
}

export default Stage;
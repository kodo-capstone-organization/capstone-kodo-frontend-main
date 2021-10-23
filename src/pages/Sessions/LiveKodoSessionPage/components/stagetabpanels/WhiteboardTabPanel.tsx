import { WhiteboardPanelWrapper } from "./StageTabPanelsElements";
import Board from "./whiteboard-components/Board";
import Tools from "./whiteboard-components/Tools";

function WhiteboardTabPanel (props: any) {

    return (
        <WhiteboardPanelWrapper>
            Whiteboard Panel (SR4)
            <Board
                style={{ width: "inherit", height: "inherit" }}
                sendWhiteboardEventViaDCCallback={props.sendWhiteboardEventViaDCCallback}
            />
            {/* TODO should be hovering on top at the bottom of the container */}
            <Tools></Tools>
        </WhiteboardPanelWrapper>
    )
}

export default WhiteboardTabPanel;
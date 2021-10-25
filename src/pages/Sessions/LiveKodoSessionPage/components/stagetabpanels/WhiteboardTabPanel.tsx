import { useState } from "react";
import { WhiteboardPanelWrapper } from "./StageTabPanelsElements";
import Board from "./whiteboard-components/Board";
import Tools from "./whiteboard-components/Tools";

const initToolProperties = {
    strokeStyle: "green",
    lineWidth: 10
}


function WhiteboardTabPanel (props: any) {

    const [activeTool, setActiveTool] = useState<string>("pen");
    const [toolProperties, setToolProperties] = useState<object>(initToolProperties);
    
    return (
        <WhiteboardPanelWrapper>
            <Tools
                style={{ top: "0", zIndex: 100, display: "flex", justifyContent: "center" }}
                activeTool={activeTool}
                setActiveTool={setActiveTool}
            />
            <Board
                style={{ width: "inherit", height: "inherit" }}
                activeTool={activeTool}
                toolProperties={toolProperties}
                sendWhiteboardEventViaDCCallback={props.sendWhiteboardEventViaDCCallback}
            />
            {/* TODO should be hovering on top at the bottom of the container */}

        </WhiteboardPanelWrapper>
    )
}

export default WhiteboardTabPanel;
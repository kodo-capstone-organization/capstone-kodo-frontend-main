import { useState } from "react";
import { WhiteboardPanelWrapper } from "./StageTabPanelsElements";
import Board from "./whiteboard-components/Board";
import Tools from "./whiteboard-components/Tools";

const initToolProperties = {
    strokeStyle: "red",
    lineWidth: 10
}


function WhiteboardTabPanel (props: any) {

    const [activeTool, setActiveTool] = useState<string>("pen");
    const [toolProperties, setToolProperties] = useState<object>(initToolProperties);
    const [isClearAllCalled, setIsClearAllCalled] = useState<boolean>(false);
    const [isNewImageAttached, setIsNewImageAttached] = useState<boolean>(false);
    
    return (
        <WhiteboardPanelWrapper>
            <Tools
                style={{ top: "0", zIndex: 100, display: "flex", justifyContent: "center"}}
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                toolProperties={toolProperties}
                setToolProperties={setToolProperties}
                setIsClearAllCalled={setIsClearAllCalled}
                setIsNewImageAttached={setIsNewImageAttached}
                callOpenSnackBar={props.callOpenSnackBar}
            />
            <Board
                style={{ width: "inherit", height: "inherit" }}
                activeTool={activeTool}
                toolProperties={toolProperties}
                isClearAllCalled={isClearAllCalled}
                setIsClearAllCalled={setIsClearAllCalled}
                isNewImageAttached={isNewImageAttached}
                setIsNewImageAttached={setIsNewImageAttached}
                sendWhiteboardEventViaDCCallback={props.sendWhiteboardEventViaDCCallback}
                incomingCanvasData={props.incomingCanvasData}
            />
        </WhiteboardPanelWrapper>
    )
}

export default WhiteboardTabPanel;
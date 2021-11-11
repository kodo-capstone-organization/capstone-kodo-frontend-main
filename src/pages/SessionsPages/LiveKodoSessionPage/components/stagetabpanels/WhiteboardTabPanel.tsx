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
    const [inputText, setInputText] = useState<string>("");
    const [isTextInsertCalled, setIsTextInsertCalled] = useState<boolean>(false);
    const [shapeInsertString, setShapeInsertString] = useState<string>("");
    const [isShapeInsertCalled, setIsShapeInsertCalled] = useState<boolean>(false);
    
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
                inputText={inputText}
                setInputText={setInputText}
                setIsTextInsertCalled={setIsTextInsertCalled}
                setShapeInsertString={setShapeInsertString}
                setIsShapeInsertCalled={setIsShapeInsertCalled}
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
                inputText={inputText}
                shapeInsertString={shapeInsertString}
                setInputText={setInputText}
                isTextInsertCalled={isTextInsertCalled}
                setIsTextInsertCalled={setIsTextInsertCalled}
                isShapeInsertCalled={isShapeInsertCalled}
                setIsShapeInsertCalled={setIsShapeInsertCalled}
                sendWhiteboardEventViaDCCallback={props.sendWhiteboardEventViaDCCallback}
                incomingCanvasData={props.incomingCanvasData}
            />
        </WhiteboardPanelWrapper>
    )
}

export default WhiteboardTabPanel;
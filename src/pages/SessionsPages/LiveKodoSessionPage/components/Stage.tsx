import { useEffect, useState } from "react";
import { monaco } from "react-monaco-editor";
import { KodoSessionEventType, EditorCursorLocation } from "../../../../entities/Session";
import {ActiveTabPanel, StageContainer, StageTab, StageTabBar } from "../LiveKodoSessionPageElements";
import CodeEditorTabPanel from "./stagetabpanels/CodeEditorTabPanel";
import DebugInfoTabPanel from "./stagetabpanels/DebugInfoTabPanel";
import WhiteboardTabPanel from "./stagetabpanels/WhiteboardTabPanel";

function Stage(props: any) {

    const [peerConns, setPeerConns] = useState<Map<number, any>>(new Map());
    const [activeTabIdx, setActiveTabIdx] = useState<number>(0);

    const [incomingCanvasData, setIncomingCanvasData] = useState<string>();
    const [incomingEditorData, setIncomingEditorData] = useState<string>();
    const [incomingSelectedLanguage, setIncomingSelectedLanguage] = useState<string>();
    const [incomingEditorCursorLocations, setIncomingEditorCursorLocations] = useState<Map<number, EditorCursorLocation>>(new Map());
    const [incomingEditorCursorSelections, setIncomingEditorCursorSelections] = useState<Map<number, monaco.Selection>>(new Map());

    useEffect(() => {
        setPeerConns(props.peerConns)
    }, [props.peerConns])

    useEffect(() => {

        const newDCMessage = props.newIncomingDcMessage;

        // New Whiteboard DC Message
        if (newDCMessage?.eventType === KodoSessionEventType.WHITEBOARD) {
            setIncomingCanvasData(newDCMessage?.event?.encodedCanvasData)
        } else if (newDCMessage?.eventType === KodoSessionEventType.EDITOR) { // New Editor DC Message
            if (newDCMessage?.event?.editorData) {
                setIncomingEditorData(newDCMessage?.event?.editorData)
            }
            if (props.newIncomingDcMessage?.event?.selectedLanguage) {
                setIncomingSelectedLanguage(newDCMessage?.event?.selectedLanguage)
            }
            if (props.newIncomingDcMessage?.event?.cursorLocation) {
                const newIncomingEditorCursorLocations = new Map(incomingEditorCursorLocations)
                newIncomingEditorCursorLocations.set(newDCMessage.peerId, newDCMessage?.event?.cursorLocation)
                setIncomingEditorCursorLocations(newIncomingEditorCursorLocations)
            }
            if(props.newIncomingDcMessage?.event?.cursorSelection) {
                const newIncomingEditorCursorSelections = new Map(incomingEditorCursorSelections)
                newIncomingEditorCursorSelections.set(newDCMessage.peerId, newDCMessage?.event?.cursorSelection)
                setIncomingEditorCursorSelections(newIncomingEditorCursorSelections)
            }
        }

    }, [props.newIncomingDcMessage])

    const getStageTabItems = () => {
        return [
            {
                myTabIdx: 0,
                myTabName: "Code Editor",
                tabPanelComponent:
                    <CodeEditorTabPanel
                        key={0}
                        sendEditorEventViaDCCallback={props.sendEditorEventViaDCCallback}
                        incomingEditorData={incomingEditorData}
                        incomingSelectedLanguage={incomingSelectedLanguage}
                        peerConns={peerConns}
                        incomingEditorCursorLocations={incomingEditorCursorLocations}
                        incomingEditorCursorSelections={incomingEditorCursorSelections}
                        callOpenSnackBar={props.callOpenSnackBar}
                    />
            },
            {
                myTabIdx: 1,
                myTabName: "Whiteboard",
                tabPanelComponent: 
                    <WhiteboardTabPanel 
                        key={1}
                        sendWhiteboardEventViaDCCallback={props.sendWhiteboardEventViaDCCallback}
                        incomingCanvasData={incomingCanvasData}
                        callOpenSnackBar={props.callOpenSnackBar}
                        peerConns={peerConns}
                    />
            }
            // {
            //     // REMOVE THIS IN FINAL PRODUCTION (and edit tab indices of code editor and whiteboard)
            //     myTabIdx: 2,
            //     myTabName: "Debug Info (FOR DEV)",
            //     tabPanelComponent:
            //         <DebugInfoTabPanel
            //             key={2}
            //             myAccountId={props.myAccountId}
            //             peerConnsKeys={Array.from(peerConns.keys()).join(", ") }
            //             dataChannelConnected={props.dataChannelConnected}
            //             sendViaWSCallback={props.sendViaWSCallback}
            //             sendCallEventViaDCCallback={props.sendCallEventViaDCCallback}
            //         />
            // },
        ]
    }

    const handleTabChange = (event: any, newActiveTabIndex: number) => {
        setActiveTabIdx(newActiveTabIndex);
    }

    return (
        <StageContainer>
            <StageTabBar
                value={activeTabIdx}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleTabChange}
            >
                {getStageTabItems().map(tabItem => (
                    <StageTab
                        key={tabItem.myTabIdx}
                        label={tabItem.myTabName}
                        style={{ minWidth: "50%"}}
                    />
                ))}
            </StageTabBar>
            <ActiveTabPanel>
                { getStageTabItems()
                    .filter((tabItem) => tabItem?.myTabIdx === activeTabIdx)
                    .map(tabItem => (tabItem.tabPanelComponent))
                }
            </ActiveTabPanel>
        </StageContainer>
    )
}

export default Stage;
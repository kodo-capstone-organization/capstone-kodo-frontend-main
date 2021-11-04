import { useEffect, useState } from "react";
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

    useEffect(() => {
        setPeerConns(props.peerConns)
    }, [props.peerConns])

    useEffect(() => {
        if (props.newIncomingDcMessage?.eventType === KodoSessionEventType.WHITEBOARD) {
            setIncomingCanvasData(props.newIncomingDcMessage?.event?.encodedCanvasData)
        }
        if (props.newIncomingDcMessage?.eventType === KodoSessionEventType.EDITOR) {
            if (props.newIncomingDcMessage?.event?.editorData) {
                setIncomingEditorData(props.newIncomingDcMessage?.event?.editorData)
            }
            if (props.newIncomingDcMessage?.event?.selectedLanguage) {
                setIncomingSelectedLanguage(props.newIncomingDcMessage?.event?.selectedLanguage)
            }
            if (props.newIncomingDcMessage?.event?.cursorLocation) {
                setIncomingEditorCursorLocations(new Map(incomingEditorCursorLocations.set(props.newIncomingDcMessage.peerId, props.newIncomingDcMessage?.event?.cursorLocation)))
            }
        }

    }, [props.newIncomingDcMessage])

    const getStageTabItems = () => {
        return [
            {
                myTabIdx: 0,
                myTabName: "Code Editor",
                tabPanelComponent: <CodeEditorTabPanel key={0}
                    sendEditorEventViaDCCallback={props.sendEditorEventViaDCCallback}
                    incomingEditorData={incomingEditorData}
                    incomingSelectedLanguage={incomingSelectedLanguage}
                    peerConns={peerConns}
                    incomingEditorCursorLocations={incomingEditorCursorLocations}
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
import { useEffect, useState } from "react";
import { KodoSessionEventType } from "../../../../entities/Session";
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

    useEffect(() => {
        setPeerConns(props.peerConns)
    }, [props.peerConns.size])

    useEffect(() => {
        if (props.newIncomingDcMessage?.eventType === KodoSessionEventType.WHITEBOARD) {
            setIncomingCanvasData(props.newIncomingDcMessage?.event?.encodedCanvasData)
        }
        if (props.newIncomingDcMessage?.eventType === KodoSessionEventType.EDITOR) {
            setIncomingEditorData(props.newIncomingDcMessage?.event?.editorData)
            if (props.newIncomingDcMessage?.event?.selectedLanguage) {
                setIncomingSelectedLanguage(props.newIncomingDcMessage?.event?.selectedLanguage)
            }
        }

    }, [props.newIncomingDcMessage])

    const getStageTabItems = () => {
        return [
            {
                // REMOVE THIS IN FINAL PRODUCTION (and edit tab indices of code editor and whiteboard)
                myTabIdx: 0,
                myTabName: "Debug Info (FOR DEV)",
                tabPanelComponent:
                    <DebugInfoTabPanel
                        key={0}
                        myAccountId={props.myAccountId}
                        peerConnsKeys={Array.from(peerConns.keys()).join(", ") }
                        dataChannelConnected={props.dataChannelConnected}
                        sendViaWSCallback={props.sendViaWSCallback}
                        sendCallEventViaDCCallback={props.sendCallEventViaDCCallback}
                    />
            },
            {
                myTabIdx: 1,
                myTabName: "Code Editor",
                tabPanelComponent: <CodeEditorTabPanel key={1} 
                    sendEditorEventViaDCCallback={props.sendEditorEventViaDCCallback}
                    incomingEditorData={incomingEditorData}
                    incomingSelectedLanguage={incomingSelectedLanguage}
                    />
            },
            {
                myTabIdx: 2,
                myTabName: "Whiteboard",
                tabPanelComponent: 
                    <WhiteboardTabPanel 
                        key={2} 
                        sendWhiteboardEventViaDCCallback={props.sendWhiteboardEventViaDCCallback}
                        incomingCanvasData={incomingCanvasData}
                    />
            }
        ]
    }

    const handleTabChange = (event: any, newActiveTabIndex: number) => {
        setActiveTabIdx(newActiveTabIndex);
    }

    return (
        <StageContainer>
            {/*stage*/}
            {/*<br/>*/}
            {/*peerConns keys: { Array.from(peerConns.keys()).join(", ") }*/}
            {/*<br/>*/}
            {/*dataChannelStatus: {props.dataChannelConnected? "connected" : "not connected"}*/}
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
                        style={{ minWidth: "25%"}}
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
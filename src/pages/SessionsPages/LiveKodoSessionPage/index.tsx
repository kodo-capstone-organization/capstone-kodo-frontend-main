import React, { useEffect, createRef, useState, RefObject, useRef } from 'react'
import {CallEvent, InvitedSessionResp, KodoDataChannelMessage, KodoSessionEvent, KodoSessionEventType, WhiteboardEvent, EditorEvent, EditorCursorLocation } from '../../../entities/Session';
import { endSession, getSessionBySessionId } from '../../../apis/SessionApis';
import ActionsPanel from './components/ActionsPanel';
import ParticipantsPanel from './components/ParticipantsPanel';
import Stage from './components/Stage';
import { LiveKodoSessionContainer, MainSessionWrapper, TopSessionBar } from './LiveKodoSessionPageElements';
import { cursorColours } from '../../../values/Colours';
import { appendSpacingToSessionId } from '../../../utils/SessionUrlHelper';
import { fontSizes } from '../../../values/FontSizes';
import { Tooltip } from '@material-ui/core';
import { monaco } from 'react-monaco-editor';

let conn: WebSocket;
let interval: NodeJS.Timer;
let localStream: MediaStream;

const rtcConfiguration: RTCConfiguration = {
    iceServers: [
        {
            urls: "stun:stun1.l.google.com:19302"
        }
    ]
};

interface RTCInfo {
    rtcPeerConnection?: RTCPeerConnection
    rtcDataChannel?: RTCDataChannel
    mediaStream?: MediaStream
    audioRef?: RefObject<HTMLAudioElement>
    isMuted?: boolean
    colour?: string
}

// URL: /session/<CREATE_OR_JOIN>/<SESSION_ID>
function LiveKodoSessionPage(props: any) {

    const myAccountId = parseInt(window.sessionStorage.getItem("loggedInAccountId") || "");
    const [initAction, setInitAction] = useState<string>(props.match.params.initAction.toLowerCase()); // "create" or "join" only
    const [sessionId, setSessionId] = useState<string>(appendSpacingToSessionId(props.match.params.sessionId));
    const [isValidSession, setIsValidSession] = useState<boolean>(false);
    const [sessionDetails, setSessionDetails] = useState<InvitedSessionResp>();
    const [dataChannelConnected, setDataChannelConnected] = useState<boolean>(false);
    const [peerConns, setPeerConns] = useState<Map<number, RTCInfo>>(new Map());
    const [amIMuted, setAmIMuted] = useState<boolean>(false);
    const [fireEffect, setFireEffect] = useState<boolean>(false);
    
    // Whiteboard States
    const [newWhiteboardOrEditorDcMessage, setNewWhiteboardOrEditorDcMessage] = useState<KodoDataChannelMessage>();

    // Special ref for amIMuted
    const amIMutedStateRef = useRef();
    // @ts-ignoret
    amIMutedStateRef.current = amIMuted;

    useEffect(() => {
        setSessionId(appendSpacingToSessionId(props.match.params.sessionId));
        getSessionBySessionId(appendSpacingToSessionId(props.match.params.sessionId), myAccountId)
            .then((sessionDetails: InvitedSessionResp) => {
                setSessionDetails(sessionDetails);
                if (initAction !== "create" && initAction !== "join") {
                    setIsValidSession(false);
                    const errorDataObj = { status: 404 }
                    props.callOpenSnackBar("Error in joining session", "error")
                    props.history.push({ pathname: "/session/invalidsession", state: { errorData: errorDataObj }})
                } else {
                    setIsValidSession(true);
                }
            })
            .catch((error) => {
                setIsValidSession(false);
                props.callOpenSnackBar("Error in joining session", "error")
                props.history.push({ pathname: "/session/invalidsession", state: { errorData: error?.response?.data }})
            })

        // On init
        cleanUpLiveSessionStorage();
        
        return () => {
            handleMyExit()
            cleanUpLiveSessionStorage()
            clearInterval(interval)
        };
    }, [])

    const cleanUpLiveSessionStorage = () => {
        window.sessionStorage.removeItem("canvasData");
        window.sessionStorage.removeItem("editorData");
        window.sessionStorage.removeItem("selectedLanguage");
        window.sessionStorage.removeItem("selectedTheme");
    }

    useEffect(() => {
        // Only if session is determined to be valid
        if (isValidSession) {
            // Give indication of success
            props.callOpenSnackBar(`Session ${initAction}ed successfully`, "success")

            // 1 - Get this user's audio stream
            const mediaConstraints = { audio : true };
            navigator.mediaDevices.getUserMedia(mediaConstraints).then(stream => { localStream = stream })

            // 2 - Connect this user to websocket signalling server + attach listeners
            conn = new WebSocket(`wss://capstone-kodo-webrtc.herokuapp.com/socket/${sessionDetails?.sessionId}`);

            // 3 - Attach onmessage event listener to websocket connection
            conn.onmessage = function(msg) {
                const content = JSON.parse(msg.data);
                const data = content.data;
                console.log("conn.onmessage: ", content.event);
                const incomingPeerId = content.peerId

                switch (content.event) {
                    case "newConnection":
                        // Make sure not to add myself nor peers that I already have registered
                        if (incomingPeerId.toString() !== myAccountId.toString()) {
                            const incomingPeerConn = setupNewPeerConn(incomingPeerId);
                            console.log("NEW CONNECTION: CREATE OFFER")
                            createOffer(incomingPeerConn);
                        }
                        break;
                    case "offer":
                        if (!peerConns.has(incomingPeerId)) {
                            setupNewPeerConn(incomingPeerId)
                            handleOffer(incomingPeerId, data);
                        }
                        break;
                    case "answer":
                        // Only handle the answers that are meant for me
                        console.log("answer")
                        if (content.sendTo === myAccountId) {
                            handleAnswer(incomingPeerId, data);
                            console.log(peerConns)
                        }
                        break;
                    // when a remote peer sends an ice candidate to us
                    case "candidate":
                        if (incomingPeerId.toString() !== myAccountId.toString()) {
                            handleCandidate(incomingPeerId, data);
                        }
                        break;
                    case "broadcast":
                        broadExistingData();
                        break;
                    case "exit":
                        handleExit(incomingPeerId);
                        break;
                    default:
                        console.log("in default switch case", content.event)
                        break;
                }
            };

            // 4 - Attach onopen event listener to websocket connection
            conn.onopen = function() {
                console.log("Connected to the signaling server");
                send({ event : "newConnection" });

                // Set consistent ping to prevent Websocket from closing
                interval = setInterval(() => conn.send(JSON.stringify({ event: "ping" })), 10000)
            };

            // 5 - Cleanup function when connection is closed (in ComponentWillUnmount return function)
            conn.onclose = function () {
                // To determine whether to send a hook to close session or not
                if (peerConns.size === 0) {
                    console.log("No peers, ending session")
                    endSession(sessionDetails?.sessionId || sessionId).then(() => {
                        console.log("Session closed successfully")
                    })
                } else {
                    console.log("there are still peer conns left. not ending whole session.")
                }

                props.history.push("/session")
                props.callOpenSnackBar(`Exiting Kodo Session: ${sessionDetails?.sessionName}`, "success")
            }
        }
    }, [isValidSession])

    // Our secret weapon </3
    useEffect(() => {
        if (fireEffect && isValidSession) {
            // Make a copy of peerConns
            let newPeerConns = new Map(peerConns)

            // Set all peer conn's srcObject
            for (let pcRtcInfo of Array.from(newPeerConns.values())) {
                if (pcRtcInfo?.audioRef?.current && pcRtcInfo.mediaStream ) {
                    pcRtcInfo.audioRef.current.srcObject = pcRtcInfo.mediaStream
                }
            }

            // Update PeerConns
            setPeerConns(newPeerConns)
            setFireEffect(false)
        }
    }, [fireEffect])

    const setupNewPeerConn = (newPeerId: number) => {
        // Clear any existing info about the old peer conn
        peerConns.delete(newPeerId)

        // Create new peer connection
        const newPeerConn = new RTCPeerConnection(rtcConfiguration)

        // Add localstream tracks to the new peer connection
        localStream?.getTracks().forEach(track => newPeerConn.addTrack(track, localStream));

        // Peer conn icecandidate event
        newPeerConn.onicecandidate = function(event) {
            if (event.candidate) {
                console.log("peer.onicecandidate");
                send({ event : "candidate", data : event.candidate });
            }
        };

        // Peer conn ontrack event (Fires when a peer adds their local stream to the shared peerconn)
        newPeerConn.ontrack = function(event) {
            console.log('AUDIO / VIDEO STREAM RECEIVED:', event.track, event.streams[0]);
            setPeerConns(new Map(peerConns.set(newPeerId, {
                rtcPeerConnection: peerConns.get(newPeerId)?.rtcPeerConnection,
                rtcDataChannel: peerConns.get(newPeerId)?.rtcDataChannel,
                audioRef: peerConns.get(newPeerId)?.audioRef,
                mediaStream: event.streams[0], // Updating this
                // Using modulo to loop through the 6 available cursor colors
                colour: cursorColours[Array.from(peerConns.keys()).indexOf(newPeerId) % 6]
            })))

            setFireEffect(true)
        };

        // TODO ("failed", "disconnected", "closed")
        // oniceconnectionstatechange = event => checkPeerDisconnect(event, peerUuid);

        const dataChannel = newPeerConn.createDataChannel("dataChannel");

        dataChannel.onopen = function(event) {
            console.log("dataChannel.onopen IN JOINER SIDE")
            setDataChannelConnected(true);
            send({ event : "broadcast" });
        }

        // when we receive a message from the other peer, printing it on the console
        dataChannel.onmessage = function(event) {
            const dcMessage: KodoDataChannelMessage = JSON.parse(event.data)
            console.log("datachannel onmessage IN JOINER SIDE:", dcMessage);
            if (dcMessage.eventType === KodoSessionEventType.CALL) {
                handleIncomingDataChannelCallEvent(dcMessage);
            } else if (dcMessage.eventType === KodoSessionEventType.WHITEBOARD || dcMessage.eventType === KodoSessionEventType.EDITOR) {
                // Propped into stage child to be handled there
                setNewWhiteboardOrEditorDcMessage(dcMessage)
            } else {
                console.error("invalid eventType on datachannel message received");
            }
        };

        dataChannel.onclose = function() {
            console.log("Data channel is closed");
        };

        dataChannel.onerror = function(error) {
            console.log("Error:", error);
        };

        newPeerConn.ondatachannel = function (event) {
            const newDataChannel = event.channel;
            newDataChannel.onopen = function(event) {
                console.log("dataChannel.onopen in CREATOR SIDE")
                setDataChannelConnected(true);
            }
            newDataChannel.onmessage = function(event) {
                const dcMessage: KodoDataChannelMessage = JSON.parse(event.data)
                console.log("dataChannel.onmessage IN CREATOR SIDE", dcMessage);
                if (dcMessage.eventType === KodoSessionEventType.CALL) {
                    handleIncomingDataChannelCallEvent(dcMessage);
                } else if (dcMessage.eventType === KodoSessionEventType.WHITEBOARD || dcMessage.eventType === KodoSessionEventType.EDITOR) {
                    // Propped into stage child to be handled there
                    setNewWhiteboardOrEditorDcMessage(dcMessage)
                } else {
                    console.error("invalid eventType on datachannel message received");
                }
            }
            setPeerConns(new Map(peerConns.set(newPeerId, {
                rtcPeerConnection: peerConns.get(newPeerId)?.rtcPeerConnection,
                rtcDataChannel: newDataChannel,
                audioRef: peerConns.get(newPeerId)?.audioRef,
                mediaStream:  peerConns.get(newPeerId)?.mediaStream,
                isMuted: peerConns.get(newPeerId)?.isMuted,
                colour: cursorColours[Array.from(peerConns.keys()).indexOf(newPeerId)]
            })))
        };

        setPeerConns(new Map(peerConns.set(newPeerId, {
            rtcPeerConnection: newPeerConn,
            rtcDataChannel: dataChannel,
            audioRef: createRef<HTMLAudioElement>(),
            mediaStream: new MediaStream(),
            isMuted: false,
            colour: cursorColours[Array.from(peerConns.keys()).indexOf(newPeerId)]
        })))

        return newPeerConn
    }

    async function createOffer(passedInPeerConn: RTCPeerConnection) {

        const offerOptions: RTCOfferOptions = {
            offerToReceiveAudio: true,
            offerToReceiveVideo: false
        };

        try {
            const offer = await passedInPeerConn?.createOffer(offerOptions);
            console.log("in createOffer with offer: ")
            console.log(offer);
            await passedInPeerConn?.setLocalDescription(offer);
            send({ event: 'offer', data: offer });
        } catch (e) {
            console.log("failed to create an offer: ", e);
        }
    }

    async function handleOffer(incomingPeerId: number, offer: any) {
        console.log("in handleOffer")

        const answerOptions: RTCAnswerOptions = {
            voiceActivityDetection: true
        };

        const incomingPeerConn = peerConns.get(incomingPeerId)?.rtcPeerConnection;

        try {
            if (incomingPeerConn) {
                await incomingPeerConn.setRemoteDescription(new RTCSessionDescription(offer));
                // Create answer to offer
                const answer = await incomingPeerConn.createAnswer(answerOptions);
                await incomingPeerConn.setLocalDescription(answer);
                setPeerConns(new Map(peerConns.set(incomingPeerId, {
                    rtcPeerConnection: incomingPeerConn,
                    rtcDataChannel: peerConns.get(incomingPeerId)?.rtcDataChannel,
                    audioRef: peerConns.get(incomingPeerId)?.audioRef,
                    mediaStream:  peerConns.get(incomingPeerId)?.mediaStream,
                    isMuted: peerConns.get(incomingPeerId)?.isMuted,
                    colour: cursorColours[Array.from(peerConns.keys()).indexOf(incomingPeerId)]
                })));
                send({ event : "answer", data : answer, sendTo: incomingPeerId });
            } else {
                console.error("unable to find peer conn with id", incomingPeerId);
            }

        } catch (e) {
            console.log("failed to create an answer: ", e)
        }
    };

    async function handleCandidate(incomingPeerId: number, candidate: any) {
        const incomingPeerConn = peerConns.get(incomingPeerId)?.rtcPeerConnection;
        if (incomingPeerConn) {
            await incomingPeerConn?.addIceCandidate(new RTCIceCandidate(candidate));
            setPeerConns(new Map(peerConns.set(incomingPeerId, {
                rtcPeerConnection: incomingPeerConn, 
                rtcDataChannel: peerConns.get(incomingPeerId)?.rtcDataChannel, 
                audioRef: peerConns.get(incomingPeerId)?.audioRef, 
                mediaStream:  peerConns.get(incomingPeerId)?.mediaStream,
                isMuted: peerConns.get(incomingPeerId)?.isMuted,
                colour: cursorColours[Array.from(peerConns.keys()).indexOf(incomingPeerId)]
            })));
        } else {
            console.error("Not adding icecandidate, cannot find peerConn with peerId", incomingPeerId)
        }
    };

    async function handleAnswer(incomingPeerId: number, answer: any) {
        console.log("in handleAnswer -> connection established successfully!!");

        const incomingPeerConn = peerConns.get(incomingPeerId)?.rtcPeerConnection;
        if (incomingPeerConn) {
            await incomingPeerConn?.setRemoteDescription(new RTCSessionDescription(answer));
            setPeerConns(new Map(peerConns.set(incomingPeerId, {
                rtcPeerConnection: incomingPeerConn, rtcDataChannel:
                peerConns.get(incomingPeerId)?.rtcDataChannel,
                audioRef: peerConns.get(incomingPeerId)?.audioRef,
                mediaStream:  peerConns.get(incomingPeerId)?.mediaStream,
                isMuted: peerConns.get(incomingPeerId)?.isMuted,
                colour: cursorColours[Array.from(peerConns.keys()).indexOf(incomingPeerId)]
            })));
        }
    };

    // When a peerconn is exiting, remove from local peerConns
    function handleExit(incomingPeerId: number) {
        if (peerConns.has(incomingPeerId)) {
            console.log("deleting peer conn of id: ", incomingPeerId)
            let copyMap = new Map(peerConns);
            peerConns.delete(incomingPeerId)
            setPeerConns(copyMap);
        }
    }

    // Sending a message to websocket server
    const send = (receivedMessage: any) => {
        receivedMessage['peerId'] = myAccountId; // Append in peerId (i.e. my account id)
        console.log("in send (via websocket server): ", receivedMessage);
        conn?.send(JSON.stringify(receivedMessage));
    }

    /* * * * * * * * * * * * * * * * * * * * * * *
     * [SENDING] Data channel message handling   *
     * * * * * * * * * * * * * * * * * * * * * * */

    // Sending a message via datachannel
    const sendDataChannelMessage = (dcMessage: KodoDataChannelMessage) => {
        console.log("in sendDataChannelMessage (via datachannel) to all other peers")
        peerConns.forEach((rtcInfo: RTCInfo) => {
            // Only send message to connections that are still connected and datachannel still open
            if (rtcInfo.rtcPeerConnection?.connectionState === "connected" && rtcInfo.rtcDataChannel?.readyState !== "closed") {
                rtcInfo.rtcDataChannel?.send(JSON.stringify(dcMessage));
            }      
        })
    }

    const craftAndSendDcMessage = (sessionEvent: KodoSessionEvent, eventType: KodoSessionEventType) => {
        const newDcMessage: KodoDataChannelMessage = {
            peerId: myAccountId,
            eventType: eventType,
            event: sessionEvent
        }
        return sendDataChannelMessage(newDcMessage);
    }

    const craftAndSendCallEventMessage = (message?: string, isMuted?: boolean) => {
        const newCallEvent: CallEvent = {
            message: message ? message : "",
            isMuted: isMuted === undefined ? amIMuted : isMuted
        }
        return craftAndSendDcMessage(newCallEvent, KodoSessionEventType.CALL)
    }
    
    const craftAndSendWhiteboardEventMessage = (encodedCanvasData?: string, cursorLocation?: string) => {
        const newWhiteboardEvent: WhiteboardEvent = {
            encodedCanvasData: encodedCanvasData ? encodedCanvasData : "",
            cursorLocation: cursorLocation ? cursorLocation : ""
        }
        return craftAndSendDcMessage(newWhiteboardEvent, KodoSessionEventType.WHITEBOARD)
    }

    const craftAndSendEditorEventMessage = (editorData?: string, selectedLanguage?: string, cursorLocation?: EditorCursorLocation, cursorSelection?: monaco.Selection) => {
        const newEditorEvent: EditorEvent = {
            editorData: editorData ? editorData : undefined,
            selectedLanguage: selectedLanguage ? selectedLanguage : undefined,
            cursorLocation: cursorLocation ? cursorLocation : undefined,
            cursorSelection: cursorSelection ? cursorSelection : undefined
        }
        return craftAndSendDcMessage(newEditorEvent, KodoSessionEventType.EDITOR)
    }

    /* * * * * * * * * * * * * * * * * * * * * * *
     * [RECEIVING] Data channel message handling   *
     * * * * * * * * * * * * * * * * * * * * * * */

    const handleIncomingDataChannelCallEvent = (dcMessage: KodoDataChannelMessage) => {
        const incomingPeerId = dcMessage.peerId;
        const callEvent: CallEvent = dcMessage.event; // typecasting

        // Printing message
        console.log(callEvent.message);

        // Handling mute
        setPeerConns(new Map(peerConns.set(incomingPeerId, {
            rtcPeerConnection: peerConns.get(incomingPeerId)?.rtcPeerConnection,
            rtcDataChannel: peerConns.get(incomingPeerId)?.rtcDataChannel,
            audioRef: peerConns.get(incomingPeerId)?.audioRef,
            mediaStream:  peerConns.get(incomingPeerId)?.mediaStream,
            isMuted: callEvent.isMuted,
            colour: cursorColours[Array.from(peerConns.keys()).indexOf(incomingPeerId)]
        })));
    }

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Action callbacks (Propped into ActionsPanel to be called from there)  *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const handleMyMuteToggle = () => {
        const newMuteState = !amIMuted;
        setAmIMuted(newMuteState)
        craftAndSendCallEventMessage("", newMuteState);

        localStream.getAudioTracks().forEach((track: MediaStreamTrack) => track.enabled = !newMuteState)
    }

    // Cleanup Callback.
    const handleMyExit = () => {
        // Clean up local states
        console.log("Closing my own websocket");
        localStream?.getTracks().forEach(track => track.stop());
        send({ event : "exit" }) // Inform peers that I am leaving
        conn?.close(); // Triggers conn.onclose cleanup function (my own exit)
    }

    const broadExistingData = () => {
        console.log("Broadcasting existing data to new user")
        craftAndSendCallEventMessage("", amIMutedStateRef.current);

        if (window.sessionStorage.getItem("canvasData") !== "") {
            //@ts-ignore
            craftAndSendWhiteboardEventMessage(window.sessionStorage.getItem("canvasData"))
        }

        if (window.sessionStorage.getItem("editorData") !== "") {
            //@ts-ignore
            craftAndSendEditorEventMessage(window.sessionStorage.getItem("editorData"), undefined)
        }

        if (window.sessionStorage.getItem("selectedLanguage") !== "") {
            //@ts-ignore
            craftAndSendEditorEventMessage(undefined, window.sessionStorage.getItem("selectedLanguage"))
        }
    }

    return (
        <>
            { isValidSession &&
                <LiveKodoSessionContainer>
                    { Array.from(peerConns.values()).map((pcRtcInfo: RTCInfo) => (
                        <audio key={pcRtcInfo.mediaStream?.id} ref={pcRtcInfo.audioRef} muted={pcRtcInfo.isMuted} autoPlay />
                    ))}
                    <TopSessionBar>
                        <Tooltip title="Session Name">
                            <strong>{sessionDetails?.sessionName}</strong>
                        </Tooltip>
                        &nbsp; · &nbsp;
                        <Tooltip title="Session ID">
                            <i style={{ fontSize: fontSizes.SUBTEXT }}>{sessionDetails?.sessionId}</i>
                        </Tooltip>
                    </TopSessionBar>
                    <MainSessionWrapper>
                        <ParticipantsPanel
                            myAccountId={myAccountId}
                            amIMuted={amIMuted}
                            peerConns={peerConns}
                            myLocalStream={localStream}
                        />
                        <Stage
                            myAccountId={myAccountId}
                            peerConns={peerConns}
                            dataChannelConnected={dataChannelConnected}
                            sendViaWSCallback={send}
                            sendCallEventViaDCCallback={craftAndSendCallEventMessage}
                            sendWhiteboardEventViaDCCallback={craftAndSendWhiteboardEventMessage}
                            sendEditorEventViaDCCallback={craftAndSendEditorEventMessage}
                            newIncomingDcMessage={newWhiteboardOrEditorDcMessage}
                            callOpenSnackBar={props.callOpenSnackBar}
                        />
                        <ActionsPanel 
                            sessionId={sessionId} 
                            callOpenSnackBar={props.callOpenSnackBar}
                            amIMuted={amIMuted}
                            handleMyMuteToggle={handleMyMuteToggle}
                            history={props.history}
                        />
                    </MainSessionWrapper>
                </LiveKodoSessionContainer>
            }
        </>
    )
}

export default LiveKodoSessionPage;
import React, { useEffect, createRef, useState, RefObject } from 'react'
import {CallEvent, InvitedSessionResp, KodoDataChannelMessage, KodoSessionEvent, KodoSessionEventType } from '../../../apis/Entities/Session';
import { endSession, getSessionBySessionId } from '../../../apis/Session/SessionApis';
import { Button } from '../../../values/ButtonElements';
import ActionsPanel from './components/ActionsPanel';
import ParticipantsPanel from './components/ParticipantsPanel';
import Stage from './components/Stage';
import { LiveKodoSessionContainer, MainSessionWrapper, TopSessionBar } from './LiveKodoSessionPageElements';

let conn: WebSocket;
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
}

// URL: /session/<CREATE_OR_JOIN>/<SESSION_ID>
function LiveKodoSessionPage(props: any) {

    const myAccountId = parseInt(window.sessionStorage.getItem("loggedInAccountId") || "");
    const [initAction, setInitAction] = useState<string>(props.match.params.initAction.toLowerCase()); // "create" or "join" only
    const [sessionId, setSessionId] = useState<string>(props.match.params.sessionId);
    const [isValidSession, setIsValidSession] = useState<boolean>(false);
    const [sessionDetails, setSessionDetails] = useState<InvitedSessionResp>();
    const [dataChannelConnected, setDataChannelConnected] = useState<boolean>(false);
    const [peerConns, setPeerConns] = useState<Map<number, RTCInfo>>(new Map());
    const [amIMuted, setAmIMuted] = useState<boolean>(false);
    const [fireEffect, setFireEffect] = useState<boolean>(false);
    const [updateParticipantsStatus, setUpdateParticipantsStatus] = useState<boolean>(false);

    useEffect(() => {
        getSessionBySessionId(props.match.params.sessionId, myAccountId)
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
    }, [])

    useEffect(() => {
        // Only if session is determined to be valid
        if (isValidSession) {
            // Give indication of success
            props.callOpenSnackBar(`Session ${initAction}ed successfully`, "success")

            // 1 - Get this user's audio stream
            const mediaConstraints = { audio : true };
            navigator.mediaDevices.getUserMedia(mediaConstraints).then(stream => { localStream = stream })

            // 2 - Connect this user to websocket signalling server + attach listeners
            conn = new WebSocket(`ws://capstone-kodo-webrtc.herokuapp.com/socket/${sessionDetails?.sessionId}`);

            // 3 - Attach onmessage event listener to websocket connection
            conn.onmessage = function(msg) {
                const content = JSON.parse(msg.data);
                const data = content.data;
                console.log("conn.onmessage: ", content.event);
                const incomingPeerId = content.peerId

                switch (content.event) {
                    case "newConnection":
                        // Make sure not to add myself nor peers that I already have registered
                        if (incomingPeerId.toString() !== myAccountId.toString() && !peerConns.has(incomingPeerId)) {
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
            };
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

    // Added a useEffect for immediate update of peerConns state once any participants updates their speaking status
    // Should be used if there's a need for an immediate update of participants info, e.g. mic or speaking status
    useEffect(() => {
        if (updateParticipantsStatus) {
            setPeerConns(new Map(peerConns))
            setUpdateParticipantsStatus(false)
        }
    }, [updateParticipantsStatus])

    const setupNewPeerConn = (newPeerId: number) => {
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
            setPeerConns(peerConns.set(newPeerId, {
                rtcPeerConnection: peerConns.get(newPeerId)?.rtcPeerConnection,
                rtcDataChannel: peerConns.get(newPeerId)?.rtcDataChannel,
                audioRef: peerConns.get(newPeerId)?.audioRef,
                mediaStream: event.streams[0] // Updating this
            }))
            setFireEffect(true)
        };

        // TODO ("failed", "disconnected", "closed")
        // oniceconnectionstatechange = event => checkPeerDisconnect(event, peerUuid);

        const dataChannel = newPeerConn.createDataChannel("dataChannel");

        dataChannel.onopen = function(event) {
            console.log("dataChannel.onopen IN JOINER SIDE")
            setDataChannelConnected(true);
        }

        // when we receive a message from the other peer, printing it on the console
        dataChannel.onmessage = function(event) {
            const dcMessage: KodoDataChannelMessage = JSON.parse(event.data)
            console.log("datachannel onmessage IN JOINER SIDE:", dcMessage);
            if (dcMessage.eventType === KodoSessionEventType.CALL) {
                handleIncomingDataChannelCallEvent(dcMessage);
            } else if (dcMessage.eventType === KodoSessionEventType.WHITEBOARD) {
                // TODO: (probably wanna prop into stage > whiteboard component to handle)
            } else if (dcMessage.eventType === KodoSessionEventType.EDITOR) {
                // TODO: (probably wanna prop into stage > editor component to handle)
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
                console.log("dataChannel.onmessage IN CREATOR SIDE")
            }
            setPeerConns(peerConns.set(newPeerId, {
                rtcPeerConnection: peerConns.get(newPeerId)?.rtcPeerConnection,
                rtcDataChannel: newDataChannel,
                audioRef: peerConns.get(newPeerId)?.audioRef,
                mediaStream:  peerConns.get(newPeerId)?.mediaStream,
                isMuted: peerConns.get(newPeerId)?.isMuted
            }))
        };

        setPeerConns(peerConns.set(newPeerId, {
            rtcPeerConnection: newPeerConn,
            rtcDataChannel: dataChannel,
            audioRef: createRef<HTMLAudioElement>(),
            mediaStream: new MediaStream(),
            isMuted: false
        }))

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
                await setPeerConns(peerConns.set(incomingPeerId, {
                    rtcPeerConnection: incomingPeerConn,
                    rtcDataChannel: peerConns.get(incomingPeerId)?.rtcDataChannel,
                    audioRef: peerConns.get(incomingPeerId)?.audioRef,
                    mediaStream:  peerConns.get(incomingPeerId)?.mediaStream,
                    isMuted: peerConns.get(incomingPeerId)?.isMuted
                }));
                send({ event : "answer", data : answer, sendTo: incomingPeerId });
            } else {
                console.error("unable to find peer conn with id", incomingPeerId);
            }

        } catch (e) {
            console.log("failed to create an answer: ", e)
        }

    };

     const handleCandidate = (incomingPeerId: number, candidate: any) => {
        const incomingPeerConn = peerConns.get(incomingPeerId)?.rtcPeerConnection;
        if (incomingPeerConn && incomingPeerConn?.remoteDescription?.type) {
            incomingPeerConn?.addIceCandidate(new RTCIceCandidate(candidate));
            setPeerConns(peerConns.set(incomingPeerId, { 
                rtcPeerConnection: incomingPeerConn, 
                rtcDataChannel: peerConns.get(incomingPeerId)?.rtcDataChannel, 
                audioRef: peerConns.get(incomingPeerId)?.audioRef, 
                mediaStream:  peerConns.get(incomingPeerId)?.mediaStream,
                isMuted: peerConns.get(incomingPeerId)?.isMuted
            }));
        } else {
            console.error("Not adding icecandidate before remote description is set for peerConn with peerId", incomingPeerId)
        }
    };

    async function handleAnswer(incomingPeerId: number, answer: any) {
        console.log("in handleAnswer -> connection established successfully!!");

        const incomingPeerConn = peerConns.get(incomingPeerId)?.rtcPeerConnection;
        if (incomingPeerConn) {
            await incomingPeerConn?.setRemoteDescription(new RTCSessionDescription(answer));
            setPeerConns(peerConns.set(incomingPeerId, {
                rtcPeerConnection: incomingPeerConn, rtcDataChannel:
                peerConns.get(incomingPeerId)?.rtcDataChannel,
                audioRef: peerConns.get(incomingPeerId)?.audioRef,
                mediaStream:  peerConns.get(incomingPeerId)?.mediaStream,
                isMuted: peerConns.get(incomingPeerId)?.isMuted
            }));
        }
    };

    // When a peerconn is exiting, remove from local peerConns
    function handleExit(incomingPeerId: number) {
        if (peerConns.has(incomingPeerId)) {
            console.log("deleting peer conn of id: ", incomingPeerId)
            let copyMap = new Map(peerConns);
            copyMap.delete(incomingPeerId)
            setPeerConns(copyMap);
        }
    }

    // Sending a message to websocket server
    const send = (receivedMessage: any) => {
        receivedMessage['peerId'] = myAccountId; // Append in peerId (i.e. my account id)
        console.log("in send (via websocket server): ", receivedMessage);
        conn.send(JSON.stringify(receivedMessage));
    }

    /* * * * * * * * * * * * * * * * * * * * * * *
     * [SENDING] Data channel message handling   *
     * * * * * * * * * * * * * * * * * * * * * * */

    // Sending a message via datachannel
    const sendDataChannelMessage = (dcMessage: KodoDataChannelMessage) => {
        console.log("in sendDataChannelMessage (via datachannel) to all other peers")
        peerConns.forEach((rtcInfo: RTCInfo) => {
            // Only send message to connections that are still connected
            if (rtcInfo.rtcPeerConnection?.connectionState === "connected") {
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
            eventType: KodoSessionEventType.CALL,
            message: message ? message : "",
            isMuted: isMuted === undefined ? amIMuted : isMuted
        }
        return craftAndSendDcMessage(newCallEvent, KodoSessionEventType.CALL)
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
        setPeerConns(peerConns.set(incomingPeerId, {
            rtcPeerConnection: peerConns.get(incomingPeerId)?.rtcPeerConnection,
            rtcDataChannel: peerConns.get(incomingPeerId)?.rtcDataChannel,
            audioRef: peerConns.get(incomingPeerId)?.audioRef,
            mediaStream:  peerConns.get(incomingPeerId)?.mediaStream,
            isMuted: callEvent.isMuted
        }));

        setUpdateParticipantsStatus(true)
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
        localStream.getTracks().forEach(track => track.stop());
        send({ event : "exit" })
        conn.close();

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

    return (
        <>
            { isValidSession &&
                <LiveKodoSessionContainer>
                    { Array.from(peerConns.values()).map((pcRtcInfo: RTCInfo) => (
                        <audio key={pcRtcInfo.mediaStream?.id} ref={pcRtcInfo.audioRef} muted={pcRtcInfo.isMuted} autoPlay />
                    ))}
                    <TopSessionBar>
                        <strong>{sessionDetails?.sessionName} ({sessionDetails?.sessionId}) · Time_Elapsed</strong>
                    </TopSessionBar>
                    <Button to="#" onClick={() => send({event: null, data: "helloWord"})}>SEND</Button>
                    <Button to="#" onClick={() => craftAndSendCallEventMessage(`hello from ${myAccountId}`)}>SEND VIA DATACHANNEL</Button>
                    <MainSessionWrapper>
                        <ParticipantsPanel
                            myAccountId={myAccountId}
                            amIMuted={amIMuted}
                            peerConns={peerConns}
                        />
                        <Stage
                            peerConns={peerConns}
                            dataChannelConnected={dataChannelConnected}
                        />
                        <ActionsPanel 
                            sessionId={sessionId} 
                            callOpenSnackBar={props.callOpenSnackBar} 
                            handleMyExit={handleMyExit} 
                            amIMuted={amIMuted}
                            handleMyMuteToggle={handleMyMuteToggle}
                        />
                    </MainSessionWrapper>
                </LiveKodoSessionContainer>
            }
        </>
    )
}

export default LiveKodoSessionPage;
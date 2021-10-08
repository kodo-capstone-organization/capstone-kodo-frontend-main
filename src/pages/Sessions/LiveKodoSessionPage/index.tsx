import React, { useEffect, useRef, useState } from 'react'
import { endSession } from '../../../apis/Session/SessionApis';
import { Button } from '../../../values/ButtonElements';
import ActionsPanel from './components/ActionsPanel';
import ParticipantsPanel from './components/ParticipantsPanel';
import Stage from './components/Stage';
import { LiveKodoSessionContainer, MainSessionWrapper, TopSessionBar } from './LiveKodoSessionPageElements';

let conn: WebSocket;
let peerConns: Map<number, RTCInfo> = new Map(); // { peerId: PeerConn, peerId2: PeerConn2, ... }
let localStream: MediaStream;

const rtcConfiguration: RTCConfiguration = {
    iceServers: [
        {
            urls: "stun:stun1.l.google.com:19302"
        }
    ]
};

interface RTCInfo {
    rtcPeerConnection?: RTCPeerConnection,
    rtcDataChannel?: RTCDataChannel
}

// URL: /session/<CREATE_OR_JOIN>/<SESSION_ID>
// To consider: Adding ?pwd=<PASSWORD> as a query param
function LiveKodoSessionPage(props: any) {

    const remoteAudioRef = useRef(null);
    const myAccountId = parseInt(window.sessionStorage.getItem("loggedInAccountId") || "");
    const [initAction, setInitAction] = useState<string>(props.match.params.initAction.toLowerCase()); // "create" or "join" only
    const [sessionId, setSessionId] = useState<string>(props.match.params.sessionId);
    const [dataChannelConnected, setDataChannelConnected] = useState<boolean>(false);

    useEffect(() => {
        // On init
        if (initAction === "create" || initAction === "join") {
            // Get this user's audio stream
            const mediaConstraints = { audio : true };
            navigator.mediaDevices.getUserMedia(mediaConstraints).then(stream => {
                localStream = stream;
            })

            conn = new WebSocket(`ws://capstone-kodo-webrtc.herokuapp.com/socket/${props.match.params.sessionId}`);

            conn.onmessage = function(msg) {
                const content = JSON.parse(msg.data);
                const data = content.data;
                console.log("conn.onmessage: ", content.event);
                const incomingPeerId = content.peerId
                
                switch (content.event) {
                    case "newConnection":
                        const incomingPeerConn = setupNewPeerConn(incomingPeerId);
                        console.log("NEW CONNECTION: CREATE OFFER")
                        createOffer(incomingPeerConn);
                        break;
                    // when somebody wants to call us
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
                        handleCandidate(incomingPeerId, data);
                        break;
                    case "exit":
                        handleExit(incomingPeerId);
                        break;
                    default:
                        console.log("in default switch case")
                        break;
                }
            };

            conn.onopen = function() {
                console.log("Connected to the signaling server");
                send({ event : "newConnection" });
            };

        } else {
            props.history.push('/invalidsession') // redirects to 404 (for now)
        }

        // Cleanup: Runs only during ComponentWillUnmount
        return () => {
            console.log("Closing websocket");
            localStream.getTracks().forEach(track => track.stop());
            send({ event : "exit" })
            conn.close();
            
            if (peerConns.size === 0) {
                endSession(sessionId).then(() => {
                    console.log("Session closed successfully")
                })
            }
        }

    }, [])

    const setupNewPeerConn = (newPeerId: number) => {
        // Create new peer connection
        const newPeerConn = new RTCPeerConnection(rtcConfiguration)

        // Add localstream tracks to the new peer connection
        localStream.getTracks().forEach(track => newPeerConn.addTrack(track, localStream));

        // Peer conn icecandidate event
        newPeerConn.onicecandidate = function(event) {
            if (event.candidate) {
                console.log("peer.onicecandidate");
                send({ event : "candidate", data : event.candidate });
            }
        };

        // Peer conn ontrack event (to add remote streams to audio object)
        newPeerConn.ontrack = function(event) {
            console.log('AUDIO / VIDEO STREAM RECEIVED:', event.track, event.streams[0]);
            // @ts-ignore
            remoteAudioRef.current.srcObject = event.streams[0]
        };

        // TODO
        // oniceconnectionstatechange = event => checkPeerDisconnect(event, peerUuid);


        const dataChannel = newPeerConn.createDataChannel("dataChannel");

        dataChannel.onopen = function(event) {
            console.log("dataChannel.onopen IN JOINER SIDE")
            setDataChannelConnected(true);
        }

        // when we receive a message from the other peer, printing it on the console
        dataChannel.onmessage = function(event) {
            console.log("datachannel onmessage IN JOINER SIDE:", event.data);
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
            peerConns.set(newPeerId, { rtcPeerConnection: peerConns.get(newPeerId)?.rtcPeerConnection, rtcDataChannel: newDataChannel })
        };

        peerConns.set(newPeerId, { rtcPeerConnection: newPeerConn, rtcDataChannel: dataChannel })

        return newPeerConn
    }

    // If "create", initialise a new active session

    // If "join", it is a peer joining into an active session

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
                peerConns.set(incomingPeerId, { rtcPeerConnection: incomingPeerConn, rtcDataChannel: peerConns.get(incomingPeerId)?.rtcDataChannel });
                send({ event : "answer", data : answer, sendTo: incomingPeerId });
            } else {
                console.error("unable to find peer conn with id", incomingPeerId);
            }

        } catch (e) {
            console.log("failed to create an answer: ", e)
        }

    };

    function handleCandidate(incomingPeerId: number, candidate: any) {
        const incomingPeerConn = peerConns.get(incomingPeerId)?.rtcPeerConnection;
        if (incomingPeerConn) {
            incomingPeerConn?.addIceCandidate(new RTCIceCandidate(candidate));
            peerConns.set(incomingPeerId, { rtcPeerConnection: incomingPeerConn, rtcDataChannel: peerConns.get(incomingPeerId)?.rtcDataChannel });
        }
    };

    async function handleAnswer(incomingPeerId: number, answer: any) {
        console.log("in handleAnswer -> connection established successfully!!");
        console.log("in handleAnswer -> incomingPeerId", incomingPeerId);

        const incomingPeerConn = peerConns.get(incomingPeerId)?.rtcPeerConnection;
        if (incomingPeerConn) {
            await incomingPeerConn?.setRemoteDescription(new RTCSessionDescription(answer));
            peerConns.set(incomingPeerId, { rtcPeerConnection: incomingPeerConn, rtcDataChannel: peerConns.get(incomingPeerId)?.rtcDataChannel });
        }
    };

    function handleExit(incomingPeerId: number) {
        if (peerConns.has(incomingPeerId)) {
            peerConns.delete(incomingPeerId)
        }
    }

    // Sending a message to websocket server
    const send = (receivedMessage: any) => {
        console.log("in sendMessage");
        receivedMessage['peerId'] = myAccountId; // Append in peerId (i.e. my account id)
        console.log(receivedMessage)
        conn.send(JSON.stringify(receivedMessage));
    }

    const sendMessage = (someInput: string) => {
        peerConns.forEach((rtcInfo: RTCInfo) => {

            // Only send message to connections that are still connected
            if (rtcInfo.rtcPeerConnection?.connectionState === "connected") {
                rtcInfo.rtcDataChannel?.send(someInput)
            }      
        })
    }

    return (
        <LiveKodoSessionContainer>
            <audio ref={remoteAudioRef} autoPlay />
            <TopSessionBar><strong>{props.location.state?.sessionName || "SESSION_NAME"} ({sessionId}) · Time_Elapsed</strong></TopSessionBar>
            <Button onClick={() => send({event: null, data: "helloWord"})}>SEND</Button>
            <Button onClick={() => sendMessage(`hello from ${myAccountId}`)}>SEND VIA DATACHANNEL</Button>
            <MainSessionWrapper>
                <ParticipantsPanel />
                <Stage dataChannelConnected={dataChannelConnected} />
                <ActionsPanel sessionId={sessionId} callOpenSnackBar={props.callOpenSnackBar}/>
            </MainSessionWrapper>
        </LiveKodoSessionContainer>
    )
}

export default LiveKodoSessionPage;
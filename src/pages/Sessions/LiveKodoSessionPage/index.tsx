import { Input } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../../../values/ButtonElements';
import ActionsPanel from './components/ActionsPanel';
import ParticipantsPanel from './components/ParticipantsPanel';
import Stage from './components/Stage';
import { LiveKodoSessionContainer, MainSessionWrapper, TopSessionBar } from './LiveKodoSessionPageElements';

let conn: WebSocket;
let peerConns: Map<number, RTCPeerConnection> = new Map(); // { peerId: PeerConn, peerId2: PeerConn2, ... }
// let peerConn: RTCPeerConnection;
let dataChannel: RTCDataChannel;
let localStream: MediaStream;

const rtcConfiguration: RTCConfiguration = {
    iceServers: [
        {
            urls: "stun:stun1.l.google.com:19302"
        }
    ]
};

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
                        setupNewPeerConn(incomingPeerId)
                        handleOffer(incomingPeerId, data);
                        break;
                    case "answer":
                        handleAnswer(incomingPeerId, data);
                        console.log(peerConns)
                        break;
                    // when a remote peer sends an ice candidate to us
                    case "candidate":
                        handleCandidate(incomingPeerId, data);
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
            conn.close();
            // TODO: Send API to backend to close the session if user is the last one in the call
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


        dataChannel = newPeerConn.createDataChannel("dataChannel");

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
            dataChannel = event.channel;
            dataChannel.onopen = function(event) {
                console.log("dataChannel.onopen in CREATOR SIDE")
                setDataChannelConnected(true);
            }
            dataChannel.onmessage = function(event) {
                console.log("dataChannel.onmessage IN CREATOR SIDE")
            }
        };

        peerConns.set(newPeerId, newPeerConn)

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

        const incomingPeerConn = peerConns.get(incomingPeerId);

        try {

            if (incomingPeerConn) {
                await incomingPeerConn.setRemoteDescription(new RTCSessionDescription(offer));
                // Create answer to offer
                const answer = await incomingPeerConn.createAnswer(answerOptions);
                await incomingPeerConn.setLocalDescription(answer);
                peerConns.set(incomingPeerId, incomingPeerConn);
                send({ event : "answer", data : answer });
            } else {
                console.error("unable to find peer conn with id", incomingPeerId);
            }

        } catch (e) {
            console.log("failed to create an answer: ", e)
        }

    };

    function handleCandidate(incomingPeerId: number, candidate: any) {
        console.log("in handleCandidate -> add Ice Candidate to peer conn");

        const incomingPeerConn = peerConns.get(incomingPeerId);
        if (incomingPeerConn) {
            incomingPeerConn?.addIceCandidate(new RTCIceCandidate(candidate));
            peerConns.set(incomingPeerId, incomingPeerConn);
        }
    };

    async function handleAnswer(incomingPeerId: number, answer: any) {
        console.log("in handleAnswer -> connection established successfully!!");

        const incomingPeerConn = peerConns.get(incomingPeerId);
        if (incomingPeerConn) {
            await incomingPeerConn?.setRemoteDescription(new RTCSessionDescription(answer));
            peerConns.set(incomingPeerId, incomingPeerConn);
        }
    };

    // Sending a message to websocket server
    const send = (receivedMessage: any) => {
        console.log("in sendMessage");
        receivedMessage['peerId'] = myAccountId; // Append in peerId (i.e. my account id)
        console.log(receivedMessage)
        conn.send(JSON.stringify(receivedMessage));
    }

    const sendMessage = (someInput: string) => {
        dataChannel?.send(someInput);
    }

    return (
        <LiveKodoSessionContainer>
            <audio ref={remoteAudioRef} autoPlay />
            <TopSessionBar><strong>{props.location.state?.sessionName || "SESSION_NAME"} ({sessionId}) · Time_Elapsed</strong></TopSessionBar>
            <Button onClick={() => send({event: null, data: "helloWord"})}>SEND</Button>
            <Button onClick={() => sendMessage("hello from datachannel")}>SEND VIA DATACHANNEL</Button>
            <MainSessionWrapper>
                <ParticipantsPanel />
                <Stage dataChannelConnected={dataChannelConnected} />
                <ActionsPanel sessionId={sessionId} callOpenSnackBar={props.callOpenSnackBar}/>
            </MainSessionWrapper>
        </LiveKodoSessionContainer>
    )
}

export default LiveKodoSessionPage;
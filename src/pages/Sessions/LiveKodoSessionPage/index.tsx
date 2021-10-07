import { Input } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { Button } from '../../../values/ButtonElements';
import ActionsPanel from './components/ActionsPanel';
import ParticipantsPanel from './components/ParticipantsPanel';
import Stage from './components/Stage';
import { LiveKodoSessionContainer, MainSessionWrapper, TopSessionBar } from './LiveKodoSessionPageElements';

let conn: WebSocket;
let peerConn: RTCPeerConnection;
let dataChannel: RTCDataChannel;

// URL: /session/<CREATE_OR_JOIN>/<SESSION_ID>
// To consider: Adding ?pwd=<PASSWORD> as a query param
function LiveKodoSessionPage(props: any) {
    
    const [initAction, setInitAction] = useState<string>(props.match.params.initAction.toLowerCase()); // "create" or "join" only
    const [sessionId, setSessionId] = useState<string>(props.match.params.sessionId);

    useEffect(() => {
        // On init
        if (initAction === "create" || initAction === "join") {
            conn = new WebSocket(`ws://capstone-kodo-webrtc.herokuapp.com/socket/${props.match.params.sessionId}`);
            conn.onmessage = function(msg) {
                const content = JSON.parse(msg.data);
                const data = content.data;
                console.log("conn.onmessage: ", content.event);

                switch (content.event) {
                    // when somebody wants to call us
                    case "offer":
                        handleOffer(data);
                        break;
                    case "answer":
                        handleAnswer(data);
                        break;
                    // when a remote peer sends an ice candidate to us
                    case "candidate":
                        handleCandidate(data);
                        break;
                    default:
                        console.log("in default switch case")
                        break;
                }
            };

            conn.onopen = function() {
                console.log("Connected to the signaling server");
                initialize();
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

    const initialize = () => {
        // Setup peer conn
        const configuration: RTCConfiguration = {
            iceServers: [ { urls: "stun:stun2.1.google.com:19302" } ]
        };
        peerConn =  new RTCPeerConnection(configuration);

        // Add this client's media stream to peer conn
        const mediaConstraints = { audio : true };
        navigator.mediaDevices.getUserMedia(mediaConstraints).then((localStream) => {
            for (const track of localStream.getTracks()) {
                peerConn.addTrack(track,  localStream);
            }
        })

        // Setup peer conn listeners
        peerConn.ontrack = function(event) {
            console.log("AUDIO / VIDEO STREAM RECEIVED:", event);
            const remoteStream = new MediaStream();
            peerConn.addTrack(event.track, remoteStream)
            console.log("ADDED STREAM TO PEERCONN:", peerConn)
            // TODO: enable some sort of state in the html
        };

        peerConn.onicecandidate = function(event) {
            if (event.candidate) {
                console.log("peer.onicecandidate");
                send({ event : "candidate", data : event.candidate });
            }
        };

        // Setup data channel & listeners
        // @ts-ignore
        dataChannel = peerConn.createDataChannel("dataChannel", { reliable: true });

        dataChannel.onerror = function(error) {
            console.log("Error:", error);
        };

        // when we receive a message from the other peer, printing it on the console
        dataChannel.onmessage = function(event) {
            console.log("datachannel onmessage:", event.data);
        };

        dataChannel.onclose = function() {
            console.log("Data channel is closed");
        };

        // Peer conn ondatachannel listener
        peerConn.ondatachannel = function (event) {
            dataChannel = event.channel;
        };

        if (initAction === "join") {
            console.log("INITIALIZE FOR JOIN: CREATE OFFER")
            createOffer(peerConn);
        }
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

    async function handleOffer(offer: any) {
        console.log("in handleOffer")

        const answerOptions: RTCAnswerOptions = {
            voiceActivityDetection: true
        };

        try {
            await peerConn?.setRemoteDescription(new RTCSessionDescription(offer));

            // Create answer to offer
            const answer = await peerConn?.createAnswer(answerOptions);
            console.log(answer);

            await peerConn?.setLocalDescription(answer);
            send({ event : "answer", data : answer });
        } catch (e) {
            console.log("failed to create an answer: ", e)
        }

    };

    function handleCandidate(candidate: any) {
        console.log("in handleCandidate -> add Ice Candidate to peer conn");
        peerConn?.addIceCandidate(new RTCIceCandidate(candidate));
    };

    async function handleAnswer(answer: any) {
        console.log("in handleAnswer -> connection established successfully!!");
        await peerConn?.setRemoteDescription(new RTCSessionDescription(answer));
    };

    // Sending a message to websocket server
    const send = (receivedMessage: any) => {
        console.log("in sendMessage");
        // receivedMessage['sessionId'] = sessionId; // Append sessionId to message
        console.log(receivedMessage)
        conn.send(JSON.stringify(receivedMessage));
    }

    const sendMessage = (someInput: string) => {
        dataChannel?.send(someInput);
    }

    return (
        <LiveKodoSessionContainer>
            <TopSessionBar><strong>{props.location.state?.sessionName || "SESSION_NAME"} ({sessionId}) · Time_Elapsed</strong></TopSessionBar>
            {/*<Button onClick={createOffer}>Create Offer</Button>*/}
            <Button onClick={() => send({event: null, data: "helloWord"})}>SEND</Button>
            <Button onClick={() => sendMessage("hello from datachannel")}>SEND VIA DATACHANNEL</Button>
            <MainSessionWrapper>
                <ParticipantsPanel />
                <Stage />
                <ActionsPanel />
            </MainSessionWrapper>
        </LiveKodoSessionContainer>
    )
}

export default LiveKodoSessionPage;
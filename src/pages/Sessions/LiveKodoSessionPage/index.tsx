import React, { useEffect, useState } from 'react'
import { Button } from '../../../values/ButtonElements';
import ActionsPanel from './components/ActionsPanel';
import ParticipantsPanel from './components/ParticipantsPanel';
import Stage from './components/Stage';
import { LiveKodoSessionContainer, MainSessionWrapper, TopSessionBar } from './LiveKodoSessionPageElements';

// URL: /session/<CREATE_OR_JOIN>/<SESSION_ID>
// To consider: Adding ?pwd=<PASSWORD> as a query param
function LiveKodoSessionPage(props: any) {
    
    const [initAction, setInitAction] = useState<string>(); // "create" or "join" only
    const [sessionId, setSessionId] = useState<string>();
    const [wsConn, setWsConn] = useState<WebSocket>();
    const [peerConn, setPeerConn] = useState<RTCPeerConnection>();
    const [dataChannel, setDataChannel] = useState<RTCDataChannel>();

    useEffect(() => {
        if (props.match.params.initAction.toLowerCase() === "create" || props.match.params.initAction.toLowerCase() === "join") {
            setInitAction(props.match.params.initAction.toLowerCase())
            setSessionId(props.match.params.sessionId)

            // Setup ws connection to signalling server
            const conn = new WebSocket('ws://capstone-kodo-webrtc.herokuapp.com/socket');

            conn.onopen = function() {
                console.log("Connected to the signaling server");
                initialize();
            };

            conn.onmessage = function(msg) {
                console.log("Got message", msg.data);
                let content = JSON.parse(msg.data);
                let data = content.data;
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
                        break;
                }
            };

            setWsConn(conn);
        } else {
            props.history.push('/invalidsession') // redirects to 404 (for now)
        }
    }, [props.match.params])

    const initialize = () => {
        // Setup peer conn
        const configuration = undefined; // TODO: set to null for now
        const peerConn =  new RTCPeerConnection(configuration);
        peerConn.onicecandidate = function(event) {
            if (event.candidate) {
                sendMessage({ event : "candidate", data : event.candidate });
            }
        };

        // Setup data channel & listeners
        // @ts-ignore
        let dataChannel = peerConn.createDataChannel("dataChannel", { reliable: true });

        dataChannel.onerror = function(error) {
            console.log("Error:", error);
        };

        dataChannel.onclose = function() {
            console.log("Data channel is closed");
        };

        // when we receive a message from the other peer, printing it on the console
        dataChannel.onmessage = function(event) {
            console.log("message:", event.data);
        };

        // Set
        peerConn.ondatachannel = function (event) {
            dataChannel = event.channel;
        };

        // Receiving a track / stream
        peerConn.ontrack = function(event) {
            console.log("AUDIO / VIDEO STREAM RECEIVED:", event);
            // TODO: enable some sort of state in the html
        };

        const constraints = { audio : true };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                stream.getTracks().forEach(function(track) {
                    peerConn.addTrack(track, stream);
                });
            })
            .catch(function(err) { /* handle the error */ });

        setPeerConn(peerConn);
        setDataChannel(dataChannel);
    }

    // If "create", initialise a new active session

    // If "join", it is a peer joining into an active session

    function createOffer() {
        peerConn?.createOffer(function(offer: any) {
            sendMessage({ event : "offer", data : offer });
            peerConn.setLocalDescription(offer);
        }, // @ts-ignore
        function(error) {
            alert("Error creating an offer");
        });
    }

    function handleOffer(offer: any) {
        peerConn?.setRemoteDescription(new RTCSessionDescription(offer));

        // create and send an answer to an offer
        peerConn?.createAnswer(function(answer: any) {
            peerConn?.setLocalDescription(answer);
            sendMessage({ event : "answer", data : answer });
        }, // @ts-ignore
        function(error) {
            alert("Error creating an answer");
        });
    };

    function handleCandidate(candidate: any) {
        peerConn?.addIceCandidate(new RTCIceCandidate(candidate));
    };

    function handleAnswer(answer: any) {
        peerConn?.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("connection established successfully!!");
    };

    // Sending a message
    const sendMessage = (receivedMessage: any) => {
        const message = "HELLO WORLD"
        wsConn?.send(JSON.stringify(message));
    }

    return (
        <LiveKodoSessionContainer>
            <TopSessionBar><strong>Session_Name ({sessionId}) · Time_Elapsed</strong></TopSessionBar>
            <Button onClick={createOffer}>Create Offer</Button>
            <Button onClick={sendMessage}>SEND</Button>
            <MainSessionWrapper>
                <ParticipantsPanel />
                <Stage />
                <ActionsPanel />
            </MainSessionWrapper>
        </LiveKodoSessionContainer>
    )
}

export default LiveKodoSessionPage;
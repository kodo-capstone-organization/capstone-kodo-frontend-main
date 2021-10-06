import React, { useEffect, useState } from 'react'
import { Button } from '../../../values/ButtonElements';
import ActionsPanel from './components/ActionsPanel';
import ParticipantsPanel from './components/ParticipantsPanel';
import Stage from './components/Stage';
import { LiveKodoSessionContainer, MainSessionWrapper, TopSessionBar } from './LiveKodoSessionPageElements';

// URL: /session/<CREATE_OR_JOIN>/<SESSION_ID>
// To consider: Adding ?pwd=<PASSWORD> as a query param
function LiveKodoSessionPage(props: any) {

    var peerConn: RTCPeerConnection;
    var dataChannel: RTCDataChannel;
    
    const [initAction, setInitAction] = useState<string>(); // "create" or "join" only
    const [sessionId, setSessionId] = useState<string>();
    const [wsConn, setWsConn] = useState<WebSocket>();
    // const [peerConn, setPeerConn] = useState<RTCPeerConnection>();
    // const [dataChannel, setDataChannel] = useState<RTCDataChannel>();

    useEffect(() => {

        // Cleanup: Runs only during ComponentWillUnmount
        return () => {
            console.log("Closing websocket");
            wsConn?.close();
            // TODO: Send API to backend to close the session if user is the last one in the call
        }

    }, [])

    useEffect(() => {
        if (props.match.params.initAction.toLowerCase() === "create" || props.match.params.initAction.toLowerCase() === "join") {
            setInitAction(props.match.params.initAction.toLowerCase())
            setSessionId(props.match.params.sessionId)

            // Setup ws connection to signalling server
            const conn = new WebSocket('ws://capstone-kodo-webrtc.herokuapp.com/socket');

            conn.onmessage = function(msg) {
                console.log("conn.onmessage: ", msg.data);
                const content = JSON.parse(msg.data);
                const data = content.data;
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

            setWsConn(conn);
        } else {
            props.history.push('/invalidsession') // redirects to 404 (for now)
        }
    }, [props.match.params.sessionId])

    const initialize = () => {
        // Setup peer conn
        const configuration = undefined; // TODO: set to null for now
        peerConn =  new RTCPeerConnection(configuration);
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

        dataChannel.onclose = function() {
            console.log("Data channel is closed");
        };

        // when we receive a message from the other peer, printing it on the console
        dataChannel.onmessage = function(event) {
            console.log("datachannel onmessage:", event.data);
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

        // setPeerConn(peerConn);
        // setDataChannel(dataChannel);
    }

    // If "create", initialise a new active session

    // If "join", it is a peer joining into an active session

    async function createOffer() {

        const offerOptions: RTCOfferOptions = {
            offerToReceiveAudio: true,
            offerToReceiveVideo: false
        };

        try {
            const offer = await peerConn?.createOffer(offerOptions);
            console.log("in createOffer with offer: ")
            console.log(offer);
            await peerConn?.setLocalDescription(offer);
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
            const answer = await peerConn?.createAnswer(answerOptions);
            console.log(answer); // for some reason this returns answer=undefined

            await peerConn?.setLocalDescription(answer);
            send({ event : "answer", data : answer });
        } catch (e) {
            console.log("failed to create an answer: ", e)
        }

    };

    function handleCandidate(candidate: any) {
        console.log("in handleCandidate -> add Ice Candidate to peer conn: ", peerConn)
        peerConn?.addIceCandidate(new RTCIceCandidate(candidate));
    };

    function handleAnswer(answer: any) {
        console.log("in handleAnswer -> connection established successfully!!");
        peerConn?.setRemoteDescription(new RTCSessionDescription(answer));
    };

    // Sending a message to websocket server
    const send = (receivedMessage: any) => {
        console.log("in sendMessage with receivedMessage: ")
        console.log(receivedMessage)
        wsConn?.send(JSON.stringify(receivedMessage));
    }

    // function sendMessage() {
    //     dataChannel?.send(input.value);
    //     input.value = "";
    // }

    return (
        <LiveKodoSessionContainer>
            <TopSessionBar><strong>Session_Name ({sessionId}) · Time_Elapsed</strong></TopSessionBar>
            <Button onClick={createOffer}>Create Offer</Button>
            <Button onClick={() => send("helloworld")}>SEND</Button>
            <MainSessionWrapper>
                <ParticipantsPanel />
                <Stage />
                <ActionsPanel />
            </MainSessionWrapper>
        </LiveKodoSessionContainer>
    )
}

export default LiveKodoSessionPage;
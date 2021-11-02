import { useEffect, useState } from 'react';
import { colours } from '../../../../../../values/Colours';

function Board (props: any) {

    // timeout;
    // var interval = setInterval(function(){
    //     if (isDrawing) {
    //         return;
    //     } else {
    //         setIsDrawing(true);
    //         clearInterval(interval);
    //         const canvas: HTMLCanvasElement | null = document.querySelector('#board');
    //         let ctx = canvas?.getContext('2d');
    //         let image = new Image();
    //         image.onload = function() {
    //             ctx?.drawImage(image, 0, 0);
    //             setIsDrawing(false)
    //         };
    //         image.src = canvasData;
    //     }
    // }, 200)

    let timeout: NodeJS.Timeout;
    let canvas: HTMLCanvasElement | null = document.querySelector('#board');
    let ctx: CanvasRenderingContext2D | null;
    const [isDrawing, setIsDrawing] = useState<boolean>(false); // whether i am currently drawing
    const [isMovingImage, setIsMovingImage] = useState<boolean>(false);

    // Tool states
    const [cursorImagePath, setCursorImagePath] = useState<string>("");

    useEffect(() => {
        if (canvas === null) {
            canvas = document.querySelector('#board');
            drawOnCanvas(true);
        }
    }, [canvas])

    useEffect(() => {
        drawOnCanvas(false, true);
        window.sessionStorage.setItem("canvasData", props.incomingCanvasData)
    }, [props.incomingCanvasData])

    useEffect(() => {
        console.log(props.activeTool)
        switch (props.activeTool) {
            case "pen":
                setCursorImagePath("/cursors/pen_cursor.svg");
                break;
            case "eraser":
                setCursorImagePath("/cursors/eraser_cursor.svg");
                break;
            default:
                // default to pen
                setCursorImagePath("/cursors/pen_cursor.svg");
                break;
        }
        // Call this again
        drawOnCanvas();
    }, [props.activeTool, props.toolProperties.lineWidth, props.toolProperties.strokeStyle])

    useEffect(() => {
        // If changes to true, clear the canvas
        if (props.isClearAllCalled) {
            // DO CLEAR ALL
            drawOnCanvas(false, false, true)
            // Finally, set back parent clear all state to false
            props.setIsClearAllCalled(false);
            window.sessionStorage.removeItem("canvasData")
        }
    }, [props.isClearAllCalled])

    useEffect(() => {
        // If changes to true, add new image to the canvas
        if (props.isNewImageAttached) {
            // Get file
            const attImageHTML: any = document.getElementById("image-attachment-upload")
            const attImageFile = attImageHTML?.files[0];

            // Handle the image insertion
            console.log("Received image in board.tsx")
            insertImage(attImageFile);

            // Finally, set back parent isNewImageAttached state to false
            props.setIsNewImageAttached(false);
        }
    }, [props.isNewImageAttached])

    const drawOnCanvas = (isInit: boolean = false, setIncomingCanvas: boolean = false, isClearAll: boolean = false) => {
        let restore_array: ImageData[] = [];
        let index = -1;

        if (canvas) {
            ctx = canvas.getContext('2d');

            // Whiteboard is initiated for the first time ever
            if (isInit) {
                // First time ever setting up canvas,
                // Make it visually fill the positioned parent
                canvas.style.width = '100%';
                canvas.style.height= '100%';
                // ...then set the internal size to match
                canvas.width  = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;

                // Filling background
                if (ctx) {
                    console.log("filling on init")
                    ctx.fillStyle = colours.GRAY7;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            }

            // Changes are coming from local user's drawings
            if (!setIncomingCanvas) {
                let mouse = {x: 0, y: 0};
                let last_mouse = {x: 0, y: 0};

                /* Mouse Capturing Work */
                canvas.addEventListener('mousemove', function(e) {
                    last_mouse.x = mouse.x;
                    last_mouse.y = mouse.y;
                    mouse.x = e.pageX- this.offsetLeft;
                    mouse.y = e.pageY - this.offsetTop;
                }, false);

                canvas.addEventListener('mousedown', function(e) {
                    canvas?.addEventListener('mousemove', onPaint, false);
                }, false);

                canvas.addEventListener('mouseup', function() {
                    canvas?.removeEventListener('mousemove', onPaint, false);
                }, false);

                const onPaint = () => {

                    if (!props.isClearAllCalled) { // prevents drawing a dot when clear all is called
                        ctx?.beginPath();
                        ctx?.moveTo(last_mouse.x, last_mouse.y);
                        ctx?.lineTo(mouse.x, mouse.y);
                        ctx?.closePath();
                        ctx?.stroke();
                    }

                    if (timeout !== undefined) {
                        clearTimeout(timeout);
                    }
                    timeout = setTimeout(function(){
                        var base64ImageData = canvas?.toDataURL("image/png");
                        props.sendWhiteboardEventViaDCCallback(base64ImageData);
                        if (base64ImageData) {
                            window.sessionStorage.setItem("canvasData", base64ImageData);
                        }
                    }, 500)
                };

                if (ctx) {
                    /* Paintbrush settings Work */
                    ctx.lineWidth = props.toolProperties.lineWidth;
                    ctx.lineJoin = 'round';
                    ctx.lineCap = 'round';
                    ctx.strokeStyle = props.toolProperties.strokeStyle;

                    if (isClearAll) {
                        ctx.fillStyle = colours.GRAY7;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        // NOTE: Manually call onPaint to send out empty canvas to other peers instead of relying on
                        // mouseup / mousedown event listeners, so that the change is instant.
                        onPaint();
                    } else if (window.sessionStorage.getItem("canvasData") !== null) {
                        let existingCanvasDataImage = new Image();

                        //@ts-ignore
                        existingCanvasDataImage.src = window.sessionStorage.getItem("canvasData")
                        existingCanvasDataImage.onload = function() {
                            if (ctx) {
                                console.log("CHANGED TAB, RE-DRAWING NOW")
                                ctx.drawImage(existingCanvasDataImage, 0, 0);
                            }
                        };
                    }
                }
            } else {
                // Changes coming from peer's canvas
                let peerCanvasDataImage = new Image();
                peerCanvasDataImage.src = props.incomingCanvasData;
                peerCanvasDataImage.onload = function() {
                    console.log("image onload")
                    if (ctx) {
                        console.log("RECEIVED PEER CANVAS, DRAWING NOW")
                        ctx.drawImage(peerCanvasDataImage, 0, 0);
                    }
                };
            }
        }
    }

    const insertImage = (attImageFile: File) => {
        // TODO
    }

    return (
        <div
            style={{ height: "inherit", width: "inherit", cursor: `url(${cursorImagePath}), auto` }}
            className="sketch" id="sketch"
        >
            <canvas className="board" id="board" />
        </div>

    )
}

export default Board
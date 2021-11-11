import { useEffect, useState } from 'react';
import { colours } from '../../../../../../values/Colours';

function Board (props: any) {

    let timeout: NodeJS.Timeout;
    let canvas: HTMLCanvasElement | null = document.querySelector('#board');
    let ctx: CanvasRenderingContext2D | null;
    const [isDrawing, setIsDrawing] = useState<boolean>(false); // whether i am currently drawing
    const [isMovingImage, setIsMovingImage] = useState<boolean>(false);
    const [isTempBoardHidden, setIsTempBoardHidden] = useState<boolean>(true); // Determines whether user is in "Edit State" or not

    // Temporary Canvas variables
    let tempCanvas: HTMLCanvasElement | null = document.querySelector('#temp-board');
    let tempCtx: CanvasRenderingContext2D | null;
    let imgWidth = 0, imgHeight = 0;

    // Tool states
    const [cursorImagePath, setCursorImagePath] = useState<string>("");

    useEffect(() => {
        if (canvas === null) {
            canvas = document.querySelector('#board');
            drawOnCanvas(true);
        }
    }, [canvas])

    useEffect(() => {
        if (tempCanvas === null) {
            tempCanvas = document.querySelector('#temp-board');
        }
    }, [tempCanvas])

    useEffect(() => {
        drawOnCanvas(false, true);
        window.sessionStorage.setItem("canvasData", props.incomingCanvasData)
    }, [props.incomingCanvasData])

    useEffect(() => {

        if (isTempBoardHidden) {
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
        } else {
            // In edit state, remove image and let move css override
            setCursorImagePath("");
        }

        // Call this again
        drawOnCanvas(false, false, false, true);
    }, [props.activeTool, props.toolProperties.lineWidth, props.toolProperties.strokeStyle, isTempBoardHidden])

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
        // If changes to true, add new image to board
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

    useEffect(() => {
        // If changes to true, add a new text box to board
        if (props.isTextInsertCalled) {
            console.log("Received text input in board.tsx")
            console.log(props.inputText)

            // Convert text to image
            const textImage: HTMLImageElement | null = convertInputTextToImageFile(props.inputText)
            if (textImage) {
                insertImage(null, textImage);
            } else {
                console.error("Unable to convert text to image")
            }

            // Finally, set back parent state to false
            props.setIsTextInsertCalled(false);

            // Clear existing text in modal
            props.setInputText("");
        }
    }, [props.isTextInsertCalled])

    const drawOnCanvas = (isInit: boolean = false, setIncomingCanvas: boolean = false, isClearAll: boolean = false, isSetContextPropertiesOnly: boolean = false) => {
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

                    if (!isSetContextPropertiesOnly) { // Early termination if we are only setting ctx
                        if (isClearAll) {
                            ctx.fillStyle = colours.GRAY7;
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            // NOTE: Manually call onPaint to send out empty canvas to other peers instead of relying on
                            // mouseup / mousedown event listeners, so that the change is instant.
                            onPaint();
                        } else if (window.sessionStorage.getItem("canvasData") !== null) {
                            let existingCanvasDataImage = new Image();
                            // @ts-ignore
                            existingCanvasDataImage.src = window.sessionStorage.getItem("canvasData")
                            existingCanvasDataImage.onload = function() {
                                if (ctx && isTempBoardHidden) {
                                    console.log("CHANGED TAB, RE-DRAWING NOW")
                                    ctx.drawImage(existingCanvasDataImage, 0, 0);
                                }
                            };
                        }
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

    const insertImage = (attImageFile: File | null, retrievedImage: HTMLImageElement | null = null) => {
        setIsTempBoardHidden(false)

        let image = new Image();
        let reader = new FileReader();

        if (retrievedImage !== null) {
            image = retrievedImage;
        } else {
            reader.addEventListener("load", function () {
                // convert image file to base64 string
                image.src = reader?.result?.toString() || "";
            }, false);
        }

        image.addEventListener("load", function () {
            console.log("Image onLoad event listener fired")

            let isDown = false;

            if (tempCanvas) {
                tempCtx = tempCanvas.getContext('2d')

                // First time ever setting up temp canvas,
                // Make it visually fill the positioned parent
                tempCanvas.style.width = '100%';
                tempCanvas.style.height= '100%';
                // ...then set the internal size to match
                tempCanvas.width  = tempCanvas.offsetWidth;
                tempCanvas.height = tempCanvas.offsetHeight;

                let start = {x: 0, y: 0};
                let img = {x: 0, y: 0};

                var MAX_WIDTH = 300;
                var MAX_HEIGHT = 300;
                imgWidth = image.width;
                imgHeight = image.height;
        
                // Add the resizing logic ONLY for attached images
                if (retrievedImage === null) {
                    if (imgWidth > imgHeight) {
                        if (imgWidth > MAX_WIDTH) {
                            imgHeight *= MAX_WIDTH / imgWidth;
                            imgWidth = MAX_WIDTH;
                        }
                    } else {
                        if (imgHeight > MAX_HEIGHT) {
                            imgWidth *= MAX_HEIGHT / imgHeight;
                            imgHeight = MAX_HEIGHT;
                        }
                    }
                }

                if (tempCtx) {
                    // Set background fill to indicate edit state
                    tempCtx = setTempContextBackgroundFill(tempCtx, 'rgba(74, 75, 169, 0.2)', tempCanvas?.width, tempCanvas?.height)
                    // Set stroke style to draw selection box later
                    tempCtx = setTempContextSelectionStyle(tempCtx);
                    // Add image to the temp canvas and draw a blue border around it to show its selection state
                    tempCtx.drawImage(image, img.x, img.y, imgWidth, imgHeight);
                    tempCtx.strokeRect(img.x, img.y, imgWidth, imgHeight);
                }
                
                tempCanvas.addEventListener('mousedown', function(e) {
                    start.x = e.pageX- this.offsetLeft;
                    start.y = e.pageY - this.offsetTop;

                    if (start.x >= img.x && start.x <= img.x + imgWidth && start.y >= img.y && start.y <= img.y + imgHeight) {
                        isDown = true;
                    } else {
                        // Outside of image range
                        // Update actual canvas with image
                        if (canvas) {
                            ctx = canvas.getContext('2d');
                            if (ctx) {
                                ctx?.drawImage(image, img.x, img.y, imgWidth, imgHeight);
                                var base64ImageData = canvas?.toDataURL("image/png");
                                props.sendWhiteboardEventViaDCCallback(base64ImageData);
                            }
                        }
                        
                        // Clear all temporary canvas data
                        if (tempCanvas && tempCtx) {
                            // Clearing up temporary canvas data
                            tempCtx?.clearRect(0, 0, tempCanvas?.width, tempCanvas?.height);
                            image = new Image();
                            reader = new FileReader();
                            start = {x: 0, y: 0};
                            img = {x: 0, y: 0};
                        }
                        setIsTempBoardHidden(true)
                    }
                }, false)

                tempCanvas.addEventListener('mouseup', function(e) {
                    isDown = false;
                }, false)

                tempCanvas.addEventListener('mouseout', function(e) {
                    isDown = false;
                }, false)

                tempCanvas.addEventListener('mousemove', function(e) {
                    if (!isDown) {
                        return;
                    }

                    let mouse = {x: 0, y: 0}
                    mouse.x = e.pageX- this.offsetLeft;
                    mouse.y = e.pageY - this.offsetTop;

                    if (!isDown) {
                        return;
                    }

                    img.x += mouse.x - start.x;
                    img.y += mouse.y - start.y;
                    start.x = mouse.x;
                    start.y = mouse.y;

                    if (tempCanvas && tempCtx) {
                        // Set opacity of canvas to not fully transparent to indicate editing state
                        tempCtx = setTempContextBackgroundFill(tempCtx, 'rgba(74, 75, 169, 0.2)', tempCanvas?.width, tempCanvas?.height)
                        // Set selection styles
                        tempCtx = setTempContextSelectionStyle(tempCtx);
                        // User moving image, redraw to new location + selection border
                        tempCtx.drawImage(image, img.x, img.y, imgWidth, imgHeight);
                        tempCtx.strokeRect(img.x, img.y, imgWidth, imgHeight);
                    }
                }, false)
            }
        }, false)

        if (attImageFile && retrievedImage === null) {
            reader.readAsDataURL(attImageFile);
        }
    }

    const convertInputTextToImageFile = (text: string): HTMLImageElement | null => {
        const textBoxCanvas: HTMLCanvasElement = document.getElementById("textbox-utility-canvas") as HTMLCanvasElement;
        if (textBoxCanvas) {
            textBoxCanvas.style.width = '100%';
            textBoxCanvas.style.height= '100%';

            const textBoxCtx = textBoxCanvas.getContext("2d");

            if (textBoxCtx) {
                // Clear existing textbox canvas data
                textBoxCtx.clearRect(0, 0, textBoxCtx.canvas.width, textBoxCtx.canvas.height);

                let maxWidth = 0;
                let totalHeight = 30;
                textBoxCtx.font='30px verdana'; // Have to pre-set font as measureText values varies based on set font

                const lines = text.split('\n');
                
                // Determine max width  
                for (var i = 0; i < lines.length; i++) {
                    maxWidth = Math.max(textBoxCtx.measureText(lines[i]).width, maxWidth);
                    totalHeight += 30;
                }

                // Set canvas dimensions
                textBoxCanvas.width = maxWidth;
                textBoxCanvas.height = totalHeight;

                // Set stroke settings after setting canvas dimensions, as it will wipe all other settings
                textBoxCtx.font='30px verdana';
                textBoxCtx.textAlign = 'left';
                textBoxCtx.textBaseline = 'middle';
                textBoxCtx.strokeStyle = 'black';
                textBoxCtx.fillStyle = props.toolProperties.strokeStyle; // Colour of words should be the tool colours
                textBoxCtx.lineWidth = 2; // Dont change this though

                const x = 0;
                const y = 30;
                const lineHeight = 30; // Determined by 30px font size

                // Fill multi line
                for (var i = 0; i < lines.length; i++) {
                    textBoxCtx.fillText(lines[i], x, y + (i * lineHeight));
                }
                
                // Convert canvas object to image
                let textAsImage = new Image();
                textAsImage.src = textBoxCtx.canvas.toDataURL("image/png");
                return textAsImage;
            }
        }
        return null;
    }

    /* * * * * * * * *
     * Abstractions  *
     * * * * * * * * */

    const setTempContextBackgroundFill = (ctxObject: CanvasRenderingContext2D, fillStyle: string, canvasWidth: number, canvasHeight: number) => {
        ctxObject.clearRect(0, 0, canvasWidth, canvasHeight);
        ctxObject.fillStyle = fillStyle;
        ctxObject.fillRect(0, 0, canvasWidth, canvasHeight);
        return ctxObject
    }

    const setTempContextSelectionStyle = (ctxObject: CanvasRenderingContext2D) => {
        // Dashed border (5px dashes and 3px spaces)
        ctxObject.strokeStyle = 'blue'
        ctxObject.setLineDash([5, 3]);
        ctxObject.lineWidth = 2

        // Glow effect
        ctxObject.shadowBlur = 20;
        ctxObject.shadowColor = 'lightblue';
        return ctxObject;
    }

    const getCursorStyle = () => {
        if (cursorImagePath === "") { // In edit state
            return 'grab';
        } else {
            return `url(${cursorImagePath}), auto`
        }
    }

    return (
        <div
            style={{ height: "100%", width: "100%", cursor: getCursorStyle(), display: "grid"}}
            className="sketch" id="sketch"
        >
            <canvas hidden className="textbox-utility-canvas" id="textbox-utility-canvas" style={{ gridArea: "1 / 1" }}/>
            <canvas hidden className="shape-utility-canvas" id="shape-utility-canvas" style={{ gridArea: "1 / 1" }}/>
            <canvas className="board" id="board" style={{ gridArea: "1 / 1" }}/>
            <canvas className="temp-board" id="temp-board" hidden={isTempBoardHidden} style={{ gridArea: "1 / 1" }}/>
        </div>

    )
}

export default Board
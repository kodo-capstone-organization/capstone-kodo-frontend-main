import { useEffect, useState } from 'react';
import { WhiteboardCursorLocation } from '../../../../../../entities/Session';
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

    // Cursor Canvas
    let cursorCanvas: HTMLCanvasElement | null = document.querySelector('#peer-cursor-board');
    let cursorCtx: CanvasRenderingContext2D | null;

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
        if (cursorCanvas === null) {
            cursorCanvas = document.querySelector('#peer-cursor-board');
            if (cursorCanvas) {
                cursorCanvas.style.width = '100%';
                cursorCanvas.style.height= '100%';
            }
        }
    }, [cursorCanvas])

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

    useEffect(() => {
        // If changes to true, add a new text box to board
        if (props.isShapeInsertCalled) {
            console.log("Received shape input in board.tsx")
            console.log(props.shapeInsertString)

            fetch(`/shapes/${props.shapeInsertString}_shape.png`)
                .then(res => res.blob())
                .then((blob) => {
                    const shapeFile = new File([blob], "shape_file");
                    insertImage(shapeFile);
                })
            
            // Finally, set back parent state to false
            props.setIsShapeInsertCalled(false);
        }
    }, [props.isShapeInsertCalled])

    // Receive update of cursor location from peers
    // useEffect(() => {
    //     if (props.incomingWhiteboardCursorLocations.size > 0) {
    //         let cursorSvg = new Image();
    //         cursorSvg.src = '/cursors/peer_cursor_4.svg';
    //         cursorSvg.addEventListener("load", function () {
    //             // Clear Cursor canvas
    //             clearCursorCanvas();
    //
    //             // Add Peers
    //             props.incomingWhiteboardCursorLocations.forEach((value: WhiteboardCursorLocation, key: number) => {
    //                 // Create peer cursor image by cloning
    //                 // const peerCursorSvg = new Image();
    //                 // peerCursorSvg.replaceWith(cursorSvg.cloneNode(true));
    //                 // peerCursorSvg.style.backgroundColor = props.peerConns.get(key).colour;
    //                 // Add peer cursor image to cursor canvas and specified location
    //                 drawOnCursorCanvas(value.cursorX, value.cursorY, cursorSvg);
    //             })
    //         })
    //     }
    //
    // }, [props.incomingWhiteboardCursorLocations])

    const drawOnCursorCanvas = (cursorX: number, cursorY: number, peerCursorImage: HTMLImageElement) => {
        if (cursorCanvas) {
            cursorCtx = cursorCanvas.getContext('2d');
            if (cursorCtx) {
                cursorCtx.imageSmoothingEnabled = false;
                cursorCtx.drawImage(peerCursorImage, cursorX, cursorY);
            }
        }
    }

    const clearCursorCanvas = () => {
        if (cursorCanvas) {
            cursorCtx = cursorCanvas.getContext('2d');
            if (cursorCtx) {
                cursorCtx.fillRect(0, 0, cursorCanvas.width, cursorCanvas.height);
                cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
            }
        }
    }

    const drawOnCanvas = (isInit: boolean = false, setIncomingCanvas: boolean = false, isClearAll: boolean = false, isSetContextPropertiesOnly: boolean = false) => {
        if (canvas) {
            let isCursorTimeoutScheduled = false;
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
                    // ctx.fillStyle = colours.GRAY7;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

                    // Sending my cursor loaction to peers every 500 ms
                    // if (!isCursorTimeoutScheduled) {
                    //     isCursorTimeoutScheduled = true;
                    //     setTimeout(function() {
                    //         isCursorTimeoutScheduled = false;
                    //         const newWhiteboardCursorLocationObject: WhiteboardCursorLocation = {
                    //             cursorX: mouse.x,
                    //             cursorY: mouse.y
                    //         }
                    //         props.sendWhiteboardEventViaDCCallback(undefined, newWhiteboardCursorLocationObject);
                    //     }, 500)
                    // }
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
                            // ctx.fillStyle = colours.GRAY7;
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
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
                        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                        ctx.drawImage(peerCanvasDataImage, 0, 0);
                    }
                };
            }
        }
    }

    function anchorHitTest(mouseX: number, mouseY: number, startX: number, startY: number, endX: number, endY: number) {

        let dx, dy;
        const rr = 256;
    
        // top-left
        dx = mouseX - startX;
        dy = mouseY - startY;
        if (dx * dx + dy * dy <= rr) {
            return (0);
        }
        // top-right
        dx = mouseX - endX;
        dy = mouseY - startY;
        if (dx * dx + dy * dy <= rr) {
            return (1);
        }
        // bottom-right
        dx = mouseX - endX;
        dy = mouseY - endY;
        if (dx * dx + dy * dy <= rr) {
            return (2);
        }
        // bottom-left
        dx = mouseX - startX;
        dy = mouseY - endY;
        if (dx * dx + dy * dy <= rr) {
            return (3);
        }
        return (-1);
    }

    const drawAllAnchors = (ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) => {
        ctx = drawDragAnchor(ctx, startX, startY);
        ctx = drawDragAnchor(ctx, endX, startY);
        ctx = drawDragAnchor(ctx, endX, endY);
        ctx = drawDragAnchor(ctx, startX, endY);
        return ctx
    }

    const drawDragAnchor = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fill();
        return ctx;
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

            let isDraggingImage = false;
            let draggingResizer = -1;

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
        
                // Add the resizing logic ONLY for attached images - Deprecated since we implemented resizing of all attachments already
                // if (retrievedImage === null) {
                //     if (imgWidth > imgHeight) {
                //         if (imgWidth > MAX_WIDTH) {
                //             imgHeight *= MAX_WIDTH / imgWidth;
                //             imgWidth = MAX_WIDTH;
                //         }
                //     } else {
                //         if (imgHeight > MAX_HEIGHT) {
                //             imgWidth *= MAX_HEIGHT / imgHeight;
                //             imgHeight = MAX_HEIGHT;
                //         }
                //     }
                // }

                if (tempCtx) {
                    // Set background fill to indicate edit state
                    tempCtx = setTempContextBackgroundFill(tempCtx, 'rgba(74, 75, 169, 0.2)', tempCanvas?.width, tempCanvas?.height)
                    
                    // Set stroke style to draw selection box later
                    tempCtx = setTempContextSelectionStyle(tempCtx);

                    // Draw the anchor at the four corners
                    tempCtx = drawAllAnchors(tempCtx, img.x, img.y, img.x + imgWidth, img.y + imgHeight)

                    // Add image to the temp canvas and draw a blue border around it to show its selection state
                    tempCtx.drawImage(image, img.x, img.y, imgWidth, imgHeight);

                    tempCtx.strokeRect(img.x, img.y, imgWidth, imgHeight);
                }
                
                tempCanvas.addEventListener('mousedown', function(e) {
                    start.x = e.pageX- this.offsetLeft;
                    start.y = e.pageY - this.offsetTop;

                    draggingResizer = anchorHitTest(start.x, start.y, img.x, img.y, img.x + imgWidth, img.y + imgHeight)

                    if ((start.x >= img.x - 16) && (start.x <= img.x + imgWidth + 16) && (start.y >= img.y - 16) && (start.y <= img.y + imgHeight + 16)) {
                        if (draggingResizer < 0) {
                            isDraggingImage = true;
                        } 
                    } else {
                        // Outside of image range
                        // Update canvas with image
                        console.log("Mousedown Outside of Image")
                        if (canvas && image.src) {
                            ctx = canvas.getContext('2d');
                            if (ctx) {
                                ctx?.drawImage(image, img.x, img.y, imgWidth, imgHeight);
                                const base64ImageData = canvas?.toDataURL("image/png");
                                props.sendWhiteboardEventViaDCCallback(base64ImageData);
                                if (base64ImageData) {
                                    window.sessionStorage.setItem("canvasData", base64ImageData);
                                }

                                // Clear all temporary canvas data
                                if (tempCanvas && tempCtx) {
                                    // Clearing up temporary canvas data
                                    tempCtx?.clearRect(0, 0, tempCanvas?.width, tempCanvas?.height);
                                    image = new Image();
                                    reader = new FileReader();
                                    start = {x: 0, y: 0};
                                    img = {x: 0, y: 0};
                                    draggingResizer = -1;
                                    isDraggingImage = false;

                                    // Reset Canvas
                                    tempCanvas = document.querySelector('#temp-board');
                                }
                                setIsTempBoardHidden(true)
                            }
                        }
                    }
                }, false)

                tempCanvas.addEventListener('mouseup', function(e) {
                    draggingResizer = -1;
                    isDraggingImage = false;
                }, false)

                tempCanvas.addEventListener('mouseout', function(e) {
                    draggingResizer = -1;
                    isDraggingImage = false;
                }, false)

                tempCanvas.addEventListener('mousemove', function(e) {
                    let mouse = {x: 0, y: 0}
                    mouse.x = e.pageX- this.offsetLeft;
                    mouse.y = e.pageY - this.offsetTop;

                    if (!isDraggingImage && draggingResizer > -1) {
                        // resize the image
                        let endX = img.x + imgWidth;
                        let endY = img.y + imgHeight;

                        switch (draggingResizer) {
                            case 0:
                                //top-left
                                img.x = mouse.x;
                                imgWidth = endX - mouse.x;
                                img.y = mouse.y;
                                imgHeight = endY - mouse.y;
                                break;
                            case 1:
                                //top-right
                                img.y = mouse.y;
                                imgWidth = mouse.x - img.x;
                                imgHeight = endY - mouse.y;
                                break;
                            case 2:
                                //bottom-right
                                imgWidth = mouse.x  - img.x;
                                imgHeight = mouse.y - img.y;
                                break;
                            case 3:
                                //bottom-left
                                img.x = mouse.x;
                                imgWidth = endX - mouse.x ;
                                imgHeight = mouse.y - img.y;
                                break;
                        }

                        if (imgWidth < 40) {imgWidth = 40;}
                        if (imgHeight < 40) {imgHeight = 40;}

                        // set the image right and bottom
                        endX = img.x + imgWidth;
                        endY = img.y + imgHeight;

                        if (tempCanvas && tempCtx) {
                            // Set opacity of canvas to not fully transparent to indicate editing state
                            tempCtx = setTempContextBackgroundFill(tempCtx, 'rgba(74, 75, 169, 0.2)', tempCanvas?.width, tempCanvas?.height)
                                
                            // Set selection styles
                            tempCtx = setTempContextSelectionStyle(tempCtx);

                            // Draw the anchor at the four corners
                            tempCtx = drawAllAnchors(tempCtx, img.x, img.y, endX, endY)
                            
                            // User moving image, redraw to new location + selection border
                            tempCtx.drawImage(image, img.x, img.y, imgWidth, imgHeight);
                            tempCtx.strokeRect(img.x, img.y, imgWidth, imgHeight);
                        }
                    } else {
                        // Move/drag the image

                        if (!isDraggingImage) {
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

                            // Draw the anchor at the four corners
                            tempCtx = drawAllAnchors(tempCtx, img.x, img.y, img.x + imgWidth, img.y + imgHeight)
                            
                            // User moving image, redraw to new location + selection border
                            tempCtx.drawImage(image, img.x, img.y, imgWidth, imgHeight);
                            tempCtx.strokeRect(img.x, img.y, imgWidth, imgHeight);
                        }
                    }
                }, false)
            }
        }, false)

        if (attImageFile && retrievedImage === null) {
            reader.readAsDataURL(attImageFile);
        }
    }

    const convertInputTextToImageFile = (text: string): HTMLImageElement | null => {
        const textBoxCanvas: HTMLCanvasElement = document.getElementById("utility-canvas") as HTMLCanvasElement;
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
            {/* To convert text to image */}
            <canvas hidden className="utility-canvas" id="utility-canvas" style={{ gridArea: "1 / 1" }}/>
            {/* Cursor Render Layer */}
            <canvas className="peer-cursor-board" id="peer-cursor-board" style={{ gridArea: "1 / 1" }}/>
            {/* Main Canvas */}
            <canvas className="board" id="board" style={{ gridArea: "1 / 1" }}/>
            {/* Image Edit Layer */}
            <canvas className="temp-board" id="temp-board" hidden={isTempBoardHidden} style={{ gridArea: "1 / 1" }}/>
        </div>

    )
}

export default Board
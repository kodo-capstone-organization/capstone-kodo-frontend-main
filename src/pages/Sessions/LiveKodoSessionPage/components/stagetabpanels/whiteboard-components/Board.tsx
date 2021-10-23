import { useEffect, useState } from 'react';

function Board (props: any) {

    // timeout;
    // socket = io.connect("http://localhost:5000");

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
    let ctx: CanvasRenderingContext2D | null;
    const [isDrawing, setIsDrawing] = useState<boolean>(false); // whether i am currently drawing
    const [canvasData, setCanvasData] = useState<any>(props.canvasData);
    const [activeTool, setActiveTool] = useState<any>();

    useEffect(() => {
        drawOnCanvas();
    }, [])

    useEffect(() => {
        setCanvasData(props.canvasData)
    }, [props.canvasData])

    useEffect(() => {

        /* {
                selectedTool: SelectedToolType
                color?: x
                radius?: x
                thickness?: x
                fontSize: x
            }
         */
        
    }, [props.toolState])

    const drawOnCanvas = () => {
        let canvas: HTMLCanvasElement | null = document.querySelector('#board');
        if (canvas) {
            ctx = canvas.getContext('2d');

            // Fit canvas
            // Make it visually fill the positioned parent
            canvas.style.width ='100%';
            canvas.style.height='100%';
            // ...then set the internal size to match
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            let mouse = {x: 0, y: 0};
            let last_mouse = {x: 0, y: 0};

            /* Mouse Capturing Work */
            canvas.addEventListener('mousemove', function(e) {
                last_mouse.x = mouse.x;
                last_mouse.y = mouse.y;

                console.log("offset", this.offsetTop)
                mouse.x = e.pageX- this.offsetLeft;
                mouse.y = e.pageY - this.offsetTop;

            }, false);


            if (ctx) {
                /* Paintbrush settings Work */
                ctx.lineWidth = 10; // fixed first
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.strokeStyle = "green";
            }

            canvas.addEventListener('mousedown', function(e) {
                canvas?.addEventListener('mousemove', onPaint, false);
            }, false);

            canvas.addEventListener('mouseup', function() {
                canvas?.removeEventListener('mousemove', onPaint, false);
            }, false);

            const onPaint = function() {
                ctx?.beginPath();
                ctx?.moveTo(last_mouse.x, last_mouse.y);
                ctx?.lineTo(mouse.x, mouse.y);
                ctx?.closePath();
                ctx?.stroke();

                if (timeout != undefined) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(function(){
                    var base64ImageData = canvas?.toDataURL("image/png");
                    props.sendWhiteboardEventViaDCCallback(base64ImageData);
                }, 1000)
            };
        }
    }


    return (
        <div style={{ height: "inherit", width: "inherit"}} className="sketch" id="sketch">
            <canvas className="board" id="board" />
        </div>

    )
}

export default Board
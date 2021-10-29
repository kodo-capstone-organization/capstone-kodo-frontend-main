
import {ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { useState, MouseEvent } from "react";
import { StyledToggleButtonGroup, ToolbarPaper } from "./WhiteboardElements";
import CreateIcon from '@material-ui/icons/Create';
import Crop169Icon from '@material-ui/icons/Crop169';
import { Divider, Slider, Typography } from "@material-ui/core";
import { colours } from "../../../../../../values/Colours";

function Tools (props: any) {

    const [colourPicked, setColourPicked] = useState<string>("green");

    const handleChangeTool = (event: MouseEvent<HTMLElement>, newTool: string) => {
        if (newTool !== null) {
            if (newTool === "eraser") {
                // Special handling for eraser: Set colour to bg colour
                handleChangeColour(null, colours.GRAY7);
            } else {
                // Change back to the preserved colour picker state in this component
                handleChangeColour(null, colourPicked);
            }
            // Actually set the tool now
            props.setActiveTool(newTool)
        }
    }

    const handleChangeThickness = (event: any, newValue: number | number[]) => {
        props.setToolProperties({
           ...props.toolProperties,
           lineWidth: newValue
        })
    }

    const handleChangeColour = (event: any, newColour: string) => {
        props.setToolProperties({
            ...props.toolProperties,
            strokeStyle: newColour
        })
    }

    return (
        <ToolbarPaper elevation={2}>
            <StyledToggleButtonGroup
                size="small"
                value={props.activeTool}
                exclusive
                onChange={handleChangeTool}
                aria-label="tool-selector"
            >
                <ToggleButton value="pen" aria-label="pen">
                    <CreateIcon />
                </ToggleButton>
                <ToggleButton value="eraser" aria-label="eraser">
                    <Crop169Icon />
                </ToggleButton>
            </StyledToggleButtonGroup>
            <Divider flexItem orientation="vertical" style={{ margin: "0.5rem"}}/>

            <div style={{ margin: "0 0 0 1rem"}}>
                <Typography id="linewidth-slider" style={{ margin: "1rem 0 0 0"}}>
                    Thickness
                </Typography>
                <Slider
                    id="linewidth-slider"
                    value={props.toolProperties.lineWidth}
                    onChange={handleChangeThickness}
                    valueLabelDisplay="auto"
                    step={5}
                    min={5}
                    max={50}
                />
            </div>


            {/*<StyledToggleButtonGroup*/}
            {/*    size="small"*/}
            {/*    value={formats}*/}
            {/*    onChange={handleFormat}*/}
            {/*    aria-label="text formatting"*/}
            {/*>*/}
            {/*    <ToggleButton value="bold" aria-label="bold">*/}
            {/*        <FormatBoldIcon />*/}
            {/*    </ToggleButton>*/}
            {/*    <ToggleButton value="italic" aria-label="italic">*/}
            {/*        <FormatItalicIcon />*/}
            {/*    </ToggleButton>*/}
            {/*    <ToggleButton value="underlined" aria-label="underlined">*/}
            {/*        <FormatUnderlinedIcon />*/}
            {/*    </ToggleButton>*/}
            {/*    <ToggleButton value="color" aria-label="color" disabled>*/}
            {/*        <FormatColorFillIcon />*/}
            {/*        <ArrowDropDownIcon />*/}
            {/*    </ToggleButton>*/}
            {/*</StyledToggleButtonGroup>*/}
        </ToolbarPaper>
    )
}

export default Tools;
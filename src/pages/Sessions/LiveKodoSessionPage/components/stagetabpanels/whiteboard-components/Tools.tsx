
import {ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { useState, MouseEvent } from "react";
import { StyledToggleButtonGroup, ToolbarPaper, CustomColor } from "./WhiteboardElements";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import CategoryIcon from '@material-ui/icons/Category';
import PaletteIcon from '@material-ui/icons/Palette';
import Crop169Icon from '@material-ui/icons/Crop169';
import UndoIcon from '@material-ui/icons/Undo';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { Divider, Slider, Typography, Tooltip, Menu, MenuItem } from "@material-ui/core";
import { colours } from "../../../../../../values/Colours";

function Tools (props: any) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [colourPicked, setColourPicked] = useState<string>("red");
    const colors = ["red", "green", "black", "blue", "yellow"];

    const handleChangeTool = (event: any, newTool: string, newColour: string) => {
        if (newTool !== null) {
            if (newTool === "eraser") {
                // Special handling for eraser: Set colour to bg colour
                handleChangeColour(null, colours.GRAY7);
            } else if (newTool === "color") {
                handleChangeColour(null, newColour);   
            } else {
                // Change back to the preserved colour picker state in this component
                handleChangeColour(null, colourPicked);
            }
            // Actually set the tool now
            props.setActiveTool(newTool)
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };
    
    const handleColorPicked = (color: string) => {
        handleChangeTool(null, "color", color);
        handleClose();
    }
    
      const handleClose = () => {
        setAnchorEl(null);
      };
    

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
                    <Tooltip title="Pen">
                        <BorderColorIcon />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="eraser" aria-label="eraser">
                    <Tooltip title="Eraser">
                        <Crop169Icon />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="color" aria-label="color" onClick={handleClick}>
                    <Tooltip title="Pick a color">
                        <PaletteIcon />
                    </Tooltip>
                </ToggleButton>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {colors.map((color, idx) => {
                        return (
                            <MenuItem onClick={() => handleColorPicked(color)}><CustomColor color={color}/></MenuItem>
                        )
                    })}
                </Menu>
                <ToggleButton value="shape" aria-label="shape">
                    <Tooltip title="Shape">
                        <CategoryIcon />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="undo" aria-label="undo">
                    <Tooltip title="Undo">
                        <UndoIcon />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="clear" aria-label="clear">
                    <Tooltip title="Clear Whiteboard">
                        <ClearAllIcon />
                    </Tooltip>
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
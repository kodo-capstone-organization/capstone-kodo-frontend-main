
import {ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { useState, MouseEvent, useEffect } from "react";
import { StyledToggleButtonGroup, ToolbarPaper, CustomColor } from "./WhiteboardElements";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import CategoryIcon from '@material-ui/icons/Category';
import PaletteIcon from '@material-ui/icons/Palette';
import Crop169Icon from '@material-ui/icons/Crop169';
import UndoIcon from '@material-ui/icons/Undo';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { Divider, Slider, Typography, Tooltip, Menu, MenuItem, Button } from "@material-ui/core";
import { colours } from "../../../../../../values/Colours";

const paletteColours = ["red", "green", "black", "blue", "yellow"];

function Tools (props: any) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [colourPicked, setColourPicked] = useState<string>("red");

    useEffect(() => {
        handleChangeTool(null, props.activeTool, colourPicked);
    }, [colourPicked])

    const handleChangeTool = (event: any, newTool: string, colour: string) => {
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

    const handleColourPicked = (colourPicked: string) => {
        // call this method again so that colour change is flushed if the tool is NOT eraser
        setColourPicked(colourPicked)
        handleClose();
    }

    const handleChangeColour = (event: any, newColour: string) => {
        props.setToolProperties({
            ...props.toolProperties,
            strokeStyle: newColour
        })
    }

    const openColourMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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

            <div style={{ margin: "0 1rem"}}>
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
            <Button onClick={openColourMenu}>
                <Tooltip title="Pick a color">
                    <PaletteIcon stroke={ colourPicked === "yellow" ? "gray" : "" } style={{ color: colourPicked, transform: "scale(1.5)" }} />
                </Tooltip>
            </Button>
            <Menu
                id="color-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {paletteColours.map((colour, idx) => {
                    return (
                        <MenuItem key={idx} onClick={() => handleColourPicked(colour)}>
                            <CustomColor color={colour}/>
                        </MenuItem>
                    )
                })}
            </Menu>
        </ToolbarPaper>
    )
}

export default Tools;
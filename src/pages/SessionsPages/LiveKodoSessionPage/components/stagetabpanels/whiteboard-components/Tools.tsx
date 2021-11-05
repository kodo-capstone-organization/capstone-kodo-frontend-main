
import {ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { useState, MouseEvent, useEffect } from "react";
import { StyledToggleButtonGroup, ToolbarPaper, CustomColor, ToolbarPropertyAction, ToolbarWhiteboardAction } from "./WhiteboardElements";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import CategoryIcon from '@material-ui/icons/Category';
import PaletteIcon from '@material-ui/icons/Palette';
import Crop169Icon from '@material-ui/icons/Crop169';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import ImageIcon from '@material-ui/icons/Image';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import { Divider, Slider, Typography, Tooltip, Menu, MenuItem, IconButton } from "@material-ui/core";
import { colours } from "../../../../../../values/Colours";
import ExportWhiteboardModal from "./ExportWhiteboardModal";

const paletteColours = ["red", "green", "black", "blue", "yellow"];

function Tools (props: any) {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [colourPicked, setColourPicked] = useState<string>("red");
    const [isExportDialogOpen, setIsExportDialogOpen] = useState<boolean>(false);

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
        handleCloseColourMenu();
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

    const handleCloseColourMenu = () => {
        setAnchorEl(null);
    };

    const handleClearAll = () => {
        // "Firing" the event
        props.setIsClearAllCalled(true);
    }

    const handleOpenExportDialog = () => {
        setIsExportDialogOpen(true)
    }

    const handleImageAttachment = (selectedImage: File) => {
        // "Firing" the event
        props.setIsNewImageAttached(true);
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
                <ToggleButton value="shape" aria-label="shape">
                    <Tooltip title="Shape">
                        <CategoryIcon />
                    </Tooltip>
                </ToggleButton>
            </StyledToggleButtonGroup>

            <Divider flexItem orientation="vertical" style={{ margin: "0.5rem"}}/>

            <ToolbarPropertyAction>
                <Typography id="linewidth-slider-label">
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
            </ToolbarPropertyAction>
            <ToolbarPropertyAction>
                <Typography id="color-picker-label">
                    Colour
                </Typography>
                <IconButton id="color-picker" onClick={openColourMenu} style={{ paddingTop: 0, justifySelf: "center" }}>
                    <Tooltip title="Pick a color">
                        <PaletteIcon stroke={ colourPicked === "yellow" ? "gray" : "" } style={{ color: colourPicked, transform: "scale(1.2)" }} />
                    </Tooltip>
                </IconButton>
                <Menu id="color-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseColourMenu}>
                    {paletteColours.map((colour, idx) => {
                        return (
                            <MenuItem key={idx} onClick={() => handleColourPicked(colour)}>
                                <CustomColor style={{ fill: colour }}/>
                            </MenuItem>
                        )
                    })}
                </Menu>
            </ToolbarPropertyAction>

            <Divider flexItem orientation="vertical" style={{ margin: "0.5rem"}}/>

            <Tooltip title="Insert Text">
                <ToolbarWhiteboardAction variant="contained"  component="label" aria-label="text">
                    <TextFieldsIcon />
                </ToolbarWhiteboardAction>
            </Tooltip>

            <Tooltip title="Insert Image">
                <ToolbarWhiteboardAction variant="contained"  component="label" aria-label="image">
                    <ImageIcon />
                    <input
                        id="image-attachment-upload"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleImageAttachment(
                            // @ts-ignore
                            e?.target?.files[0]
                        )}
                    />
                </ToolbarWhiteboardAction>
            </Tooltip>
            <Tooltip title="Clear Whiteboard">
                <ToolbarWhiteboardAction onClick={handleClearAll} aria-label="clear">
                    <ClearAllIcon />
                </ToolbarWhiteboardAction>
            </Tooltip>
            <Tooltip title="Export">
                <ToolbarWhiteboardAction onClick={handleOpenExportDialog} aria-label="export">
                    <SystemUpdateAltIcon />
                </ToolbarWhiteboardAction>
            </Tooltip>

            <ExportWhiteboardModal
                isExportDialogOpen={isExportDialogOpen}
                setIsExportDialogOpen={setIsExportDialogOpen}
                callOpenSnackBar={props.callOpenSnackBar}
                sessionName="placeholder"
            />
        </ToolbarPaper>
    )
}

export default Tools;
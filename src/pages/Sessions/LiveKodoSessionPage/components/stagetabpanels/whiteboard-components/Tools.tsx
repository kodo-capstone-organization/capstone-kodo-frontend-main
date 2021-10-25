import { Paper } from "@material-ui/core";
import {ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { useState, MouseEvent } from "react";
import { StyledToggleButtonGroup } from "./WhiteboardElements";
import CreateIcon from '@material-ui/icons/Create';
import Crop169Icon from '@material-ui/icons/Crop169';

function Tools (props: any) {

    const handleChangeTool = (event: MouseEvent<HTMLElement>, newTool: string) => {
        if (newTool !== null) {
            props.setActiveTool(newTool)
        }
    }

    return (
        <Paper elevation={1} style={{ backgroundColor: "offwhite", display: "flex", justifyContent: "center"}}>
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
            {/*<Divider flexItem orientation="vertical" className={classes.divider} />*/}
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
        </Paper>
    )
}

export default Tools;
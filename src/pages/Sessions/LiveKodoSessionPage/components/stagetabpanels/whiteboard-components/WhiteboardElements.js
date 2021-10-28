import styled from "styled-components";
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { colours } from "../../../../../../values/Colours";
import { Paper, IconButton } from "@material-ui/core";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
    margin: 1rem;
    border: none;
`;

export const ToolbarPaper = styled(Paper)`
    background: offwhite;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70%;
    margin: 1rem;
`;

export const ToolbarPropertyAction = styled.div`
    margin: 1rem 1rem 0 1rem;
    align-self: flex-start;
`;

export const ToolbarWhiteboardAction = styled(IconButton)`
    height: max-content;
`;

export const CustomColor = styled(FiberManualRecordIcon)`
    color: ${props => props.color ? props.color : "white"};
`
    
        
import styled from "styled-components";
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { colours } from "../../../../../../values/Colours";
import { Paper } from "@material-ui/core";

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
    margin: 1rem;
    border: none;
`;

export const ToolbarPaper = styled(Paper)`
    background: offwhite;
    display: flex;
    justify-content: center;
    width: 70%;
    margin: 1rem;
`;
    
        
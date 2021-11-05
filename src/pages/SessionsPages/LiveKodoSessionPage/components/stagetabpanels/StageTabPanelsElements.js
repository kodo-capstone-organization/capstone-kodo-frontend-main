import styled from "styled-components";
import { fontSizes } from "../../../../../values/FontSizes";
import { colours } from "../../../../../values/Colours";
import { Fab, Grid } from "@material-ui/core";

export const DebugInfoPanelWrapper = styled.div`
    padding: 1.5rem;
`;

export const WhiteboardPanelWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: inherit;
    width: inherit;
`;

export const CodeEditorPanelWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: inherit;
    width: inherit;
`;

export const EditorTopBarGrid = styled(Grid)`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: ${colours.GRAY7};
    border-bottom: solid 1px ${colours.GRAY5};
`;

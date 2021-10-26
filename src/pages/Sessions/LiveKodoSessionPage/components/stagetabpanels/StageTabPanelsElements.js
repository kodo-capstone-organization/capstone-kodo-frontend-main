import styled from "styled-components";
import { fontSizes } from "../../../../../values/FontSizes";
import { colours } from "../../../../../values/Colours";
import { Fab } from "@material-ui/core";

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

export const LanguageSelectorButton = styled(Fab)`
`;
import styled from "styled-components";
import { fontSizes } from "../../../values/FontSizes";
import { colours } from "../../../values/Colours";
import { Tabs } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";

export const LiveKodoSessionContainer = styled.div`
    display: flex;
    flex-direction: column;
    font-family: "Roboto", sans-serif;
    font-size: ${fontSizes.ITEM};
    height: 94vh;
    overflow-y: hidden;
    color: ${colours.GRAY3};
`;

export const TopSessionBar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 5%;
    background-color: ${colours.GRAY7};
    border-bottom: 1px solid ${colours.BLUE2};
`;

export const MainSessionWrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
`;

export const ParticipantsPanelContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 8%;
    height: 100%;
    padding: 1rem 0;
    justify-content: flex-start;
    align-items: center;
`;

export const StageContainer = styled.div`
    width: 84%;
    height: 100%;
    border-right: 1px solid ${colours.GRAY6};
    border-left: 1px solid ${colours.GRAY6};
    background: ${colours.GRAYHALF6};
`;

export const ActionsPanelContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 8%;
    height: 100%;
    padding: 1rem 0;
    justify-content: flex-start;
    align-items: center;
`;

export const ActionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: ${fontSizes.SUBTEXT};
    padding: 1rem 0;
`;

export const StageTabBar = styled(Tabs)`
    background-color: ${colours.WHITE};
    border-bottom: solid 1px ${colours.GRAY5};
`;

export const StageTab = styled(Tab)`
    min-width: 25%;
`;

export const ActiveTabPanel = styled.div`
    background: ${colours.GRAY7};
    height: 100%;
`;
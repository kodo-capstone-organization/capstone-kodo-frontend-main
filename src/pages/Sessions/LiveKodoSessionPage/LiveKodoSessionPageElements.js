import styled from "styled-components";
import { fontSizes } from "../../../values/FontSizes";
import { colours } from "../../../values/Colours";

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
    padding: 1rem;
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
    font-size: ${fontSizes.SUBTEXT}
`;
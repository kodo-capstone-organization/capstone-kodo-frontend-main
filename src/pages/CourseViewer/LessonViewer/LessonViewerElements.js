import styled from "styled-components";
import { colours } from "../../../values/Colours";
import { fontSizes } from "../../../values/FontSizes";

export const LessonContainer = styled.div`
    padding: 2rem;
    font-family: "Roboto", sans-serif;
    > * {
        margin: 0 0 1rem 0;
    }

`
export const LessonCard = styled.div`
    height: auto;
    width: auto;
    border-radius: 20px;
    margin-bottom: 40px;
    background: ${colours.GRAY7}
`;
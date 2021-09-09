import styled from "styled-components";
import { colours } from "../../../values/Colours";
import { fontSizes } from "../../../values/FontSizes";

export const LessonContainer = styled.div`
    //display: flex;
    //flex-direction: rows;
    padding: 2rem;
    font-family: "Roboto", sans-serif;
    > * {
        margin: 0 0 2rem 0;
    }
`

export const LessonTitle = styled.div`
    font-size:${fontSizes.HEADER};
    color: ${colours.GRAY3}
`

export const CourseTitle = styled.div`
    font-size: ${fontSizes.SUBHEADER};
    color: ${colours.GRAY4};
`
export const LessonCard = styled.div`
    height: auto;
    width: auto;
    border-radius: 20px;
    margin-bottom: 40px;
    background: ${colours.GRAY7}
`;
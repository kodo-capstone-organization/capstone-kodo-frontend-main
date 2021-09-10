import styled from "styled-components";
import BookIcon from '@material-ui/icons/Book';
import { colours } from "../../../values/Colours";
import { fontSizes } from "../../../values/FontSizes";

export const LessonContainer = styled.div`
    display: flex;
    height: calc(100vh - 80px);
    flex-direction: column;
    padding: 2rem;
    font-family: "Roboto", sans-serif;
    > * {
        margin: 0 0 2rem 0;
    }
`

export const LessonTitle = styled.div`
    padding-left: 19px;
    font-size:${fontSizes.HEADER};
    color: ${colours.GRAY3}
`

export const CourseTitle = styled.div`
    padding-left: 19px;
    font-size: ${fontSizes.SUBHEADER};
    color: ${colours.GRAY4};
`
export const LessonCard = styled.div`
    height: auto;
    width: auto;
    margin-bottom: 40px;
    border: 1px solid ${colours.GRAY6}
`;

export const LessonHeader = styled.div`
    font-size: ${fontSizes.CONTENT};
    color: ${colours.GRAY3};
    font-weight: bold;
    margin-bottom: 20px;
    padding: 20px 20px 0 20px;
`

export const LessonDescription = styled.div`
    font-size: ${fontSizes.SUBTEXT};
    color: ${colours.GRAY3};
    padding: 0 20px 20px 20px;


`
export const ContentMenu = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 45px);
    text-align: left;

`
export const ContentLink = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: ${fontSizes.SUBTEXT};
    text-decoration: none;
    list-style: none;
    transition: 0.2s ease-in-out;
    color: ${colours.GRAY5};
    cursor: pointer;
    font-family: "Roboto", sans-serif;
    padding: 0 20px 0 20px;


    &.active {  
        color: ${colours.BLUE1};
        background: ${colours.GRAY7};
    }
    &:hover {
        color: ${colours.BLUE1};
        background: ${colours.GRAY7};
        transition: 0.2s ease-in-out;
    }
`

export const ReadingIcon = styled(BookIcon)`
    padding-right: 8px;
`
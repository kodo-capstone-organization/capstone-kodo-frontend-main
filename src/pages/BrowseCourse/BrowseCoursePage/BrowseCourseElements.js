import styled from "styled-components";
import Card from "@material-ui/core/Card";
import { fontSizes } from "../../../values/FontSizes";
import { colours } from "../../../values/Colours";


export const BrowseContainer = styled.div`
    padding: 2rem;
    font-family: "Roboto", sans-serif;
    > * {
        margin: 0 0 2rem 0;
    }
`;

export const CourseWrapper = styled.div`
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(10,1fr);

    @media screen and (max-width: 1800px) {
        grid-template-columns: repeat(8, 1fr);
    }

    @media screen and (max-width: 1530px) {
        grid-template-columns: repeat(6, 1fr);
    }

    @media screen and (max-width: 1263px) {
        grid-template-columns: repeat(4, 1fr);
    }
    
    @media screen and (max-width: 990px) {
        grid-template-columns: repeat(2, 1fr);
    }
`

export const CourseCard = styled(Card)`
    width: 240px;
`
export const Title = styled.h4`
    color: ${colours.GRAY2};
    margin-top: 200px;
`




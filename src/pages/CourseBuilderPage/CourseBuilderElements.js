import styled from "styled-components";
import { fontSizes } from "../../values/FontSizes";
import { colours } from "../../values/Colours";
import { 
    Card, 
    CardContent,
    CardHeader
} from "@material-ui/core";

export const CourseBuilderContainer = styled.div`
    padding: 2rem;
    font-family: "Roboto", sans-serif;
    font-size: ${fontSizes.CONTENT};
    > * {
        margin: 0 0 2rem 0;
    }
`; // add bottom margin of 2rem to all direct children of ProfileContainer

export const CourseBuilderCard = styled(Card)`
    width: 100%;
`;

export const CourseBuilderContent = styled(CardContent)`
    display: flex;
    flex-direction: row;
    background-color: ${colours.WHITE};
    color: ${colours.GRAY2};
    align-items: center;
    padding: 2rem !important;
`;

export const CourseBuilderCardHeader = styled(CardHeader)`
    display: flex;
    flex-direction: row;
    background-color: ${colours.GRAYHALF6};
    color: ${colours.GRAY3};
    height: 1.5rem;
    
    > .MuiCardHeader-content > span {
        font-size: ${fontSizes.CONTENT};
        font-weight: bold;
    }
    
    > .MuiCardHeader-action {
        margin: initial;
        align-self: center;
        color: ${colours.GRAY2};
        
        >.MuiIconButton-root >.MuiIconButton-label {
           font-size: ${fontSizes.SUBTEXT} !important;
        }
    }
`;
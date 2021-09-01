import styled from "styled-components";
import {Avatar, Card, CardHeader, CardContent} from "@material-ui/core";
import { fontSizes } from "../../values/FontSizes";
import { colours } from "../../values/Colours";

export const ProfileContainer = styled.div`
    padding: 2rem;
    font-family: "Roboto", sans-serif;
    font-size: ${fontSizes.CONTENT};
    > * {
        margin: 0 0 2rem 0;
    }
`; // add bottom margin of 2rem to all direct children of ProfileContainer

export const ProfileCard = styled(Card)`
    width: 100%;
`;

export const ProfileCardHeader = styled(CardHeader)`
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

export const ProfileCardContent = styled(CardContent)`
    display: flex;
    flex-direction: row;
    background-color: ${colours.WHITE};
    color: ${colours.GRAY2};
    align-items: center;
    padding: 2rem !important;
`;

export const ProfileAvatar = styled(Avatar)`
`;

export const ProfileInitials = styled.div`
    font-size: ${fontSizes.HEADER};
`;

export const ProfileDetails = styled.div`
    margin-left: 1.5rem;
    flex-direction: column;
`;

export const ProfileName = styled.div`
    font-size: ${fontSizes.HEADER};
    font-weight: bold;
`

export const ProfileUsername = styled.div`
    font-size: ${fontSizes.SUBTEXT};
    font-style: italic;
    color: ${colours.GRAY3};
`;
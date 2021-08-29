import styled from "styled-components";
import {Avatar, Card, CardContent} from "@material-ui/core";
import { fontSizes } from "../../values/FontSizes";
import { colours } from "../../values/Colours";

export const ProfileContainer = styled.div`
    padding: 2rem;
    font-family: "Roboto", sans-serif;
    font-size: ${fontSizes.CONTENT};
`;

export const ProfileCard = styled(Card)`
    width: 100%;
`;

export const ProfileCardContent = styled(CardContent)`
    display: flex;
    flex-direction: row;
    background-color: ${colours.GRAY7};
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
    margin-left: 2rem;
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
`
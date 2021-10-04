import styled from "styled-components";
import { fontSizes } from "../../../values/FontSizes";
import { colours } from "../../../values/Colours";
import { Breadcrumbs, Typography } from '@material-ui/core';

export const SessionPageContainer = styled.div`
    padding: 2rem;
    font-family: "Roboto", sans-serif;
    font-size: ${fontSizes.CONTENT};
    > * {
        margin: 0 0 3rem 0;
    }
`; // add bottom margin of 2rem to all direct children of SessionPageContainer

export const SessionPageCreateOrJoinContainer = styled.div`
`;

export const SessionPageInvitedSessions = styled.div`

`;

export const SessionPageBreadcrumbs = styled(Breadcrumbs)`
    margin-bottom: 1rem !important;
`;

export const SessionPageDescription = styled.div`
    color: ${colours.GRAY4};
    font-size: ${fontSizes.ITEM};
`;



export const SessionPageTypography = styled(Typography)`
    color: ${colours.GRAY3};
    font-weight: 900;
    margin-bottom: 1rem !important;
`;
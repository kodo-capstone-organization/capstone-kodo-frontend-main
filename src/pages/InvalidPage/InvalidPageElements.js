import styled from "styled-components";
import { TextField, Card, CardHeader, CardContent, CardActions } from "@material-ui/core";
import { fontSizes } from "../../values/FontSizes";
import { colours } from "../../values/Colours";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export const BlankStateContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center; 
    text-align: center; 
    align-items: center;
    width: 100%;
    color: ${colours.GRAY4};
    padding: 2rem 0;

    > * {
        margin: 0 0 1rem 0;
    }    
`;

export const ArrowBack = styled(ArrowBackIcon)`
    vertical-align: middle;
    color: #3f51b5; 
    marginRight: 5px;
`;
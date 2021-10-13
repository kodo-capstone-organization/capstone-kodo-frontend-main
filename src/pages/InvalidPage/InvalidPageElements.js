import styled from "styled-components";
import { TextField, Card, CardHeader, CardContent, CardActions } from "@material-ui/core";
import { fontSizes } from "../../values/FontSizes";
import { colours } from "../../values/Colours";

export const BlankStateContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center; 
    text-align: center; 
    align-items: center;
    width: 100%;
    color: ${colours.GRAY4};
    
    > * {
        margin: 0 0 1rem 0;
    }    
`;
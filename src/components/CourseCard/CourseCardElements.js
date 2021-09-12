import styled from "styled-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Typography } from "@material-ui/core";


export const CourseCardWrapper = styled(Card)`
    border-radius: 20px !important;
    width: 220px;
`
export const CourseCardContent = styled(CardContent)`
    height: 30px;
    font-size: 18px !important;
`

export const TypoGraphyCustom = styled(Typography)`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden; 
`
import styled from "styled-components";

import { Link } from 'react-scroll'

import { 
    Card, 
    CardContent,
    CardHeader, 
    Avatar,
    OutlinedInput
} from "@material-ui/core";

import { fontSizes } from "../../values/FontSizes";
import { colours } from "../../values/Colours";
import { Button } from "../../values/ButtonElements";


export const ForumContainer = styled.div`
    padding: 2rem;
    font-family: "Roboto", sans-serif;
    font-size: ${fontSizes.CONTENT};
    > * {
        margin: 0 0 2rem 0;
    }
`; // add bottom margin of 2rem to all direct children of QuizContainer

export const ForumCard = styled(Card)`
    width: 100%;
`;

export const ForumCardHeader = styled(CardHeader)`
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
        display: flex;
        flex-direction: row;
        margin: initial;
        align-self: center;
        color: ${colours.GRAY2};
        
        >.MuiIconButton-root >.MuiIconButton-label {
           font-size: ${fontSizes.SUBTEXT} !important;
        }
    }
`;

export const ForumCardContent = styled(CardContent)`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    background-color: ${colours.WHITE};
    color: ${colours.GRAY2};
    align-items: center;
    padding: 2rem !important;
    padding: ${({ removePadTop }) => (removePadTop ? "0 2rem 2rem 2rem !important" : "2rem !important")};
    justify-content: center;
`;

export const ForumThreadCard = styled(Card)`
    width: 1200px;
    border-radius : 10px;
    padding: 16px;
    display: block;
    margin: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const ForumThreadCardContent = styled(CardContent)`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    background-color: ${colours.WHITE};
    color: ${colours.GRAY2};
    align-items: center;
    padding: 2rem !important;
    padding: ${({ removePadTop }) => (removePadTop ? "0 2rem 2rem 2rem !important" : "2rem !important")};
    justify-content: center;
`;

export const EmptyStateText = styled.h1`
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY4};
  font-family: "Roboto", sans-serif;
  text-align: center;
  padding: 50px;
`;

export const EmptyStateContainer = styled.div`
  display: ${({ threadsExist }) =>
  threadsExist ? "none" : "flex"};
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY4};
  font-family: "Roboto", sans-serif;
  flex-direction: column;
  justify-content: center; 
  text-align: center; 
  align-items: center;
  padding: 50px;
`;

export const ForumPostCard = styled(Card)`
    width: 1200px;
    border-radius : 10px;
    padding: 10px;
    margin: 10px;
    display: flex;
    flex-direction: column;
`;

export const ForumPostCardContent = styled(CardContent)`
    display: flex;
    flex-direction: flex;
    flex-wrap: wrap;
    background-color: ${colours.WHITE};
    color: ${colours.GRAY2};
    padding: 2rem !important;
    padding: ${({ removePadTop }) => (removePadTop ? "0 2rem 2rem 2rem !important" : "2rem !important")};
`;

export const ForumAvatar = styled(Avatar)`
    width: 100px;
    height: 100px;
`;

export const ForumButton = styled(Button)`
    margin: 10px;
`

export const ForumTextField = styled(OutlinedInput)`
    margin: 10px;
    width: 500px;
`

export const ScrollLink = styled(Link)`
    text-decoration: underline;
    color: #3f51b5;
    cursor: pointer;
`;

export const ForumPostReplyCard = styled(Card)`
    width: 1000px;
    border-radius : 10px;
    padding: 10px;
    margin: auto;
    display: flex;
    flex-direction: column;
`;

export const ForumPostReplyCardContent = styled(CardContent)`
    display: flex;
    flex-direction: flex;
    flex-wrap: wrap;
    background-color: ${colours.WHITE};
    color: ${colours.GRAY2};
    padding: 2rem !important;
    padding: ${({ removePadTop }) => (removePadTop ? "0 2rem 2rem 2rem !important" : "2rem !important")};
`;
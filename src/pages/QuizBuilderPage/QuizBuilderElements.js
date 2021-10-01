import styled from "styled-components";
import { TextField, Card, CardHeader, CardContent, Select } from "@material-ui/core";
import { fontSizes } from "../../values/FontSizes";
import { colours } from "../../values/Colours";
import { Button } from "../../values/ButtonElements";


export const QuizContainer = styled.div`
    padding: 2rem;
    font-family: "Roboto", sans-serif;
    font-size: ${fontSizes.CONTENT};
    > * {
        margin: 0 0 2rem 0;
    }
`; // add bottom margin of 2rem to all direct children of QuizContainer

export const QuizCard = styled(Card)`
    width: 100%;
`;

export const QuizQuestionCard = styled(Card)`
    width: 800px;
    border-radius : 10px;
    padding: 16px;
    display: flex;
    margin: 10px;
`;

export const QuizCardHeader = styled(CardHeader)`
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

export const QuizCardContent = styled(CardContent)`
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

export const QuizBuilderCardContent = styled(CardContent)`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    background-color: ${colours.GRAY7};
    color: ${colours.GRAY2};
    align-items: center;
    justify-content: center;
`;

export const QuizSelectMenu = styled(Select)`
    width: 100%;
`;

export const QuizBuilderTextInput = styled(TextField)`
    width: 100%;
    margin: 16px;
`;

export const QuizEmptyStateText = styled.h1`
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY4};
  font-family: "Roboto", sans-serif;
  text-align: center;
  padding: 50px;
`;

export const QuizEmptyStateContainer = styled.div`
  display: ${({ coursesExist }) =>
  coursesExist ? "none" : "flex"};
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY4};
  font-family: "Roboto", sans-serif;
  flex-direction: column;
  justify-content: center; 
  text-align: center; 
  align-items: center;
  padding: 50px;
`;

export const AddQuizOptionButton = styled(Button)`
    width: fit-content;
    margin: 4px auto;
`
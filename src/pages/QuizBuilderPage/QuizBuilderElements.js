import styled from "styled-components";
import { TextField, Avatar, Card, CardHeader, CardContent, CardActions, Select } from "@material-ui/core";
import { fontSizes } from "../../values/FontSizes";
import { colours } from "../../values/Colours";

export const QuizBreadcrumbItems = [
    {
        name: "Quiz",
        subpath: "/Quiz",
        fullpath: "/Quiz"
    }
]

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
    width: 100%;
    border-radius : 10px;
    padding: 16px;
    width: 70%;
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

export const QuizCardActions = styled(CardActions)`
    padding: 1rem 2rem !important;
    flex-wrap: wrap;
`;

export const QuizAvatar = styled(Avatar)`
`;

export const QuizInitials = styled.div`
    font-size: ${fontSizes.HEADER};
`;

export const QuizDetails = styled.div`
    margin-left: 1.5rem;
    flex-direction: column;
`;

export const QuizName = styled.div`
    font-size: ${fontSizes.HEADER};
    font-weight: bold;
`

export const QuizContentText = styled.div`
    font-size: ${fontSizes.CONTENT};
    color: ${colours.GRAY3};
    white-space: pre-line;
`;


export const QuizSubText = styled.div`
    font-size: ${fontSizes.SUBTEXT};
    color: ${colours.GRAY3};
`;

export const QuizUsername = styled.div`
    margin-top: 0.2rem;
    font-size: ${fontSizes.SUBTEXT};
    font-style: italic;
    color: ${colours.GRAY3};
`;

export const QuizSettingField = styled(TextField)`
    width: -webkit-fill-available;
    margin: 20px;
    
`;

export const TextSpan = styled.span`
    color: ${props => props.isActive ? colours.GREEN : colours.RED};
`;

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

export const QuizSelectMenu = styled(Select)`
    width: 400px;
`;

export const QuizBuilderTextInput = styled(TextField)`
    width: 100%;
    margin: 16px;
`;
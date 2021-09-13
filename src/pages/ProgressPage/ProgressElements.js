import styled from "styled-components";
import { colours } from "../../values/Colours";
import { fontSizes } from "../../values/FontSizes";
import { Link as LinkR } from "react-router-dom";
import {
  Avatar, Typography
} from "@material-ui/core";



export const ProgressContainer = styled.div`
    padding: 2rem;
    font-family: "Roboto", sans-serif;
    font-size: ${fontSizes.CONTENT};
    > * {
        margin: 0 0 2rem 0;
    }
`; // add bottom margin of 2rem to all direct children of ProfileContainer


export const Subject = styled.h1`
  font-size: ${fontSizes.SUBTEXT};
  color: ${props => props.primary ? colours.BLUE1 : colours.GRAY3};
  font-family: "Roboto", sans-serif;
  margin: 2px;
`;

export const SubjectContainer = styled.h1`
  width: 300px;
`;

export const EmptyStateText = styled.h1`
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY4};
  font-family: "Roboto", sans-serif;
  text-align: center;
  padding: 50px;
`;

export const EmptyStateContainer = styled.div`
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

export const MultiMediaText = styled.h3`
  font-size: 10px;
  color: ${props => props.primary ? colours.BLUE1 : colours.GRAY3};
  font-family: "Roboto", sans-serif;
`;

export const LessonAvatar = styled(Avatar)`
  margin: 10px;
`;

export const CourseElement = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

export const Button = styled(LinkR)`
  border-radius: 10px;
  background: ${({ primary }) => (primary ? colours.BLUE1 : colours.GRAY7)};
  white-space: nowrap;
  padding: ${({ big }) => (big ? "14px 48px" : "8px 30px")};
  color: ${({ primary }) => (primary ? colours.WHITE : colours.GRAY2)};
  text-decoration: none;
  font-size: ${({ fontBig }) => (fontBig ? fontSizes.CONTENT : fontSizes.SUBTEXT)};
  font-weight: bold;
  outline: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;
  font-family: "Roboto", sans-serif;
  height: 20px;
  width: 100px;
  margin: auto 10px auto auto;


  &:hover {
    transition: all 0.2s ease-in-out;
    background: ${({ primary }) => (primary ? colours.BLUE2 : colours.GRAY6)};
    color: ${({ primary }) => (primary ? colours.WHITE : colours.GRAY1 )};
  }
`;

export const MessageContainer = styled.div`
  display: flex;
  margin: 3rem;
  align-items: center;
  justify-content: center;
`

export const Message = styled.h1`
  display: flex;
  color: ${colours.BLUE1}
`



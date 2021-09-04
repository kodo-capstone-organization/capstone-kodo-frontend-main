import styled from "styled-components";
import { colours } from "../../values/Colours";
import Chip from '@material-ui/core/Chip';
import { fontSizes } from "../../values/FontSizes";
import { Link as LinkR } from "react-router-dom";


export const Title = styled.h1`
  font-size: ${fontSizes.HEADER};
  color: ${props => props.primary ? colours.BLUE1 : colours.GRAY3};
  font-family: "Roboto", sans-serif;
`;

export const Subject = styled.h1`
  font-size: ${fontSizes.SUBTEXT};
  color: ${props => props.primary ? colours.BLUE1 : colours.GRAY3};
  font-family: "Roboto", sans-serif;
`;

export const TutorName = styled.h3`
  font-size: ${fontSizes.SUBTEXT};
  color: ${props => props.primary ? colours.BLUE1 : colours.GRAY3};
  font-family: "Roboto", sans-serif;
`;

export const MultiMediaText = styled.h3`
  font-size: 10px;
  color: ${props => props.primary ? colours.BLUE1 : colours.GRAY3};
  font-family: "Roboto", sans-serif;
`;

export const CourseDetails = styled.div`
    display: flex;
    flex-direction: column;
`;

export const CourseElement = styled.div`
  display: flex;
  width: 100%;
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
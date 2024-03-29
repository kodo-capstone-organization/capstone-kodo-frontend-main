import styled from "styled-components";
import { Link } from "react-router-dom";
import BookIcon from "@material-ui/icons/Book";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import { colours } from "../../../../values/Colours";
import { fontSizes } from "../../../../values/FontSizes";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import ImageIcon from '@material-ui/icons/Image';
import { MdArrowForward, MdArrowBack } from "react-icons/md";
import * as FaIcons from 'react-icons/fa'
import Box from '@material-ui/core/Box';

import { Card, CardHeader, CardContent } from "@material-ui/core";

export const LessonViewerContainerElement = styled.div`
  padding: 2rem;
  font-family: "Roboto", sans-serif;
  font-size: ${fontSizes.CONTENT};
  > * {
      margin: 0 0 2rem 0;
  }
  display: flex;
  justify-content: center;
`;

export const LessonViewerInnerContainerElement = styled.div`
  width: 70%;
`;

export const LessonViewerCardElement = styled(Card)`
  width: 100%;
`;

export const LessonViewerHeaderElement = styled(CardHeader)`
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

export const LessonViewerContentElement = styled(CardContent)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background-color: ${colours.WHITE};
  color: ${colours.GRAY2};
  align-items: left;
  padding: 2rem !important;
  padding: ${({ removePadTop }) => (removePadTop ? "0 2rem 2rem 2rem !important" : "2rem !important")};
`;

export const LessonViewerProgress = styled(Box)`
  margin: 1em 1em 0 1em;
`;

export const LessonViewerLine = styled.div`
  border-bottom: 1px solid ${colours.GRAYHALF6};;
  margin: 1em 0;
`

export const LessonTitle = styled.div`
  font-size: ${fontSizes.HEADER};
  color: ${colours.GRAY3};
`;

export const CourseTitle = styled.div`
  font-size: ${fontSizes.SUBHEADER};
  color: ${colours.GRAY4};
`;

export const ContentMenu = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
`;

export const ContentLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 55px;
  font-size: ${fontSizes.SUBTEXT};
  text-decoration: none;
  list-style: none;
  transition: 0.2s ease-in-out;
  color: ${colours.GRAY5};
  cursor: pointer;
  pointer-events: ${({ previousCompleted }) =>
  (!previousCompleted) ? "none" : "auto"};
  font-family: "Roboto", sans-serif;
  padding: 0 20px 0 20px;

  &.active {
    color: ${colours.BLUE1};
    background: ${colours.GRAY7};
  }
  &:hover {
    color: ${colours.BLUE1};
    background: ${colours.GRAY7};
    transition: 0.2s ease-in-out;
  }
`;

export const ZipIcon = styled(FaIcons.FaFileArchive)`
  padding-right: 8px;
  height: 22px;
  width: auto;
`

export const ReadingIcon = styled(BookIcon)`
  padding-right: 8px;
`;

export const PlayIcon = styled(PlayCircleFilledIcon)`
  padding-right: 8px;
`;

export const CheckIcon = styled(CheckCircleOutlineIcon)`
    margin-left: 20px;
    color: green;
`

export const Image = styled(ImageIcon)`
  padding-right: 8px;
`;

export const QuizRow = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    font-size: ${fontSizes.SUBTEXT};
    color: ${colours.GRAY5};
    font-family: "Roboto", sans-serif;
    padding: 0 20px 0 0;
    margin-right: 20px;
    margin-left: 20px;
    border-bottom: 1px solid ${colours.GRAY6};
    height: 3em;
`

export const QuizSubheader = styled.div`
    color: ${colours.GRAY2};
    font-size: ${fontSizes.SUBTEXT};
    font-weight: bolder;
    margin-right: 20px;
`

export const QuizDescription = styled.div`
    color: ${colours.GRAY3};
    font-size: ${fontSizes.SUBTEXT};
    margin-right: 20px;
`

export const QuizDescriptionTwo = styled.div`
    color: ${colours.GRAY3};
    font-size: ${fontSizes.SUBTEXT};
    margin-right: 5rem;
`

export const BtnWrapper = styled.div`
  margin-left: 1rem;
  margin-top: -8px;
`

export const ExitWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
`

export const ExitLink = styled(Link)`
`;

export const ExitIcon = styled(CancelOutlinedIcon)`
  color: ${colours.BLUE2};
  padding: 2rem;
  font-size: 40px;
`

export const ExitText = styled.p`

`

export const NextBtnWrapper = styled.div`
  display: ${({ lessonCompleted }) =>
  (lessonCompleted) ? "flex" : "none"};;
  justify-content: flex-end;
  align-items: center;
  margin-left: auto;
  margin-top: 2em;
`

export const PrevBtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: auto;
  margin-top: 2em;
`


export const ArrowBackward = styled(MdArrowBack)`
  vertical-align: middle;
  font-size: ${fontSizes.CONTENT};
`;

export const ArrowForward = styled(MdArrowForward)`
    vertical-align: middle;
    font-size: ${fontSizes.CONTENT};
`;



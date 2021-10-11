import styled from "styled-components";
import { Link } from "react-router-dom";
import { colours } from "../../../values/Colours";
import { fontSizes } from "../../../values/FontSizes";
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

import { Card, CardHeader, CardContent } from "@material-ui/core";


export const MultimediaViewerContainerElement = styled.div`
  padding: 2rem;
  font-family: "Roboto", sans-serif;
  font-size: ${fontSizes.CONTENT};
  > * {
      margin: 0 0 2rem 0;
  }
  display: flex;
  justify-content: center;
`;

export const MultimediaViewerInnerContainerElement = styled.div`
  width: 70%;
`;

export const MultimediaViewerCardElement = styled(Card)`
  width: 100%;
`;

export const MultimediaViewerHeaderElement = styled(CardHeader)`
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

export const MultimediaViewerContentElement = styled(CardContent)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background-color: ${colours.WHITE};
  color: ${colours.GRAY2};
  align-items: left;
  padding: 2rem !important;
  padding: ${({ removePadTop }) => (removePadTop ? "0 2rem 2rem 2rem !important" : "2rem !important")};
`;

export const MultimediaName = styled.div`
  color: ${colours.GRAY2};
  font-size: ${fontSizes.SUBHEADER};
  margin-right: 20px;
  margin-bottom: 5px;
`

export const MultimediaDescription = styled.div`
  color: ${colours.GRAY3};
  font-size: ${fontSizes.ITEM};
  margin-right: 20px;
  margin-bottom: 5px;
`

export const MultimediaActionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

export const MultimediaActionButtonWrapper = styled.div`
  margin: 0 5px;
`

export const MultimediaViewerLine = styled.div`
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

export const VideoCard = styled.div`
  height: auto;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PDFCard = styled.div`
  height: auto;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const DocumentCard = styled.div`
  height: auto;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ImageCard = styled.div`
  height: 600px;
  width: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align:center
`;

export const BtnWrapper = styled.div`
  height: auto;
  width: auto;
  display: flex;
  margin-left: 1rem;
  margin-top: -8px;
  justify-content: center;
`;

export const MultimediaHeader = styled.div`
  font-size: ${fontSizes.CONTENT};
  color: ${colours.GRAY3};
  font-weight: bold;
  margin-bottom: 20px;
  padding: 20px 20px 0 20px;
`;

export const MultimediaDoneButtonWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

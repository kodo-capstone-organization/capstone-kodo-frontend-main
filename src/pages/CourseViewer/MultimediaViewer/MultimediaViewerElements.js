import styled from "styled-components";
import { Link } from "react-router-dom";
import BookIcon from "@material-ui/icons/Book";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import { colours } from "../../../values/Colours";
import { fontSizes } from "../../../values/FontSizes";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

export const MultimediaContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  font-family: "Roboto", sans-serif;
  > * {
    margin: 0 0 2rem 0;
  }
`;

export const PageHeadingAndButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export const PageHeading = styled.div`
  padding-left:19px;
`

export const LessonTitle = styled.div`
  font-size: ${fontSizes.HEADER};
  color: ${colours.GRAY3};
`;

export const CourseTitle = styled.div`
  font-size: ${fontSizes.SUBHEADER};
  color: ${colours.GRAY4};
`;

export const HeadingDescription = styled.div`
  margin-top: 10px;
  font-size: ${fontSizes.SUBTEXT};
  color: red;
`;

export const LessonCard = styled.div`
  height: auto;
  width: auto;
  margin-bottom: 40px;
  border: 1px solid ${colours.GRAY6};
`;

export const LessonHeader = styled.div`
  font-size: ${fontSizes.CONTENT};
  color: ${colours.GRAY3};
  font-weight: bold;
  margin-bottom: 20px;
  padding: 20px 20px 0 20px;
`;

export const LessonDescription = styled.div`
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY3};
  padding: 0 20px 20px 20px;
`;
export const ContentMenu = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(4, 45px);
  text-align: left;
`;

export const ReadingIcon = styled(BookIcon)`
  padding-right: 8px;
`;

export const PlayIcon = styled(PlayCircleFilledIcon)`
  padding-right: 8px;
`;

export const BtnWrapper = styled.div`
  margin-left: 1rem;
  margin-top: -8px;
`

export const ExitWrapper = styled(Link)`
  display: flex;
`

export const ExitIcon = styled(CancelOutlinedIcon)`
  color: ${colours.BLUE2};
  padding: 2rem;
  font-size: 40px;
`

export const ExitText = styled.p`

`


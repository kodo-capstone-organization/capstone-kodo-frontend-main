import styled from "styled-components";
import { Link } from "react-router-dom";
import { colours } from "../../../values/Colours";
import { fontSizes } from "../../../values/FontSizes";

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

export const MultimediaCard = styled.div`
  height: auto;
  width: auto;
  margin-bottom: 40px;
  border: 1px solid ${colours.GRAY6};
`;

export const VideoCard = styled.div`
  height: auto;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const PDFCard = styled.div`
  height: auto;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ImageCard = styled.div`
  height: auto;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const MultimediaHeader = styled.div`
  font-size: ${fontSizes.CONTENT};
  color: ${colours.GRAY3};
  font-weight: bold;
  margin-bottom: 20px;
  padding: 20px 20px 0 20px;
`;

export const MultimediaName = styled.div`
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY3};
  padding: 0 20px 20px 20px;
`;

export const MultimediaDescription = styled.div`
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY3};
  padding: 0 20px 20px 20px;
`;

export const ExitWrapper = styled(Link)`
  display: flex;
`


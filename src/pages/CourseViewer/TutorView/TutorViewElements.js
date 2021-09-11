import styled from "styled-components";
import { colours } from "../../../values/Colours";
import { fontSizes } from "../../../values/FontSizes";

export const TutorContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  font-family: "Roboto", sans-serif;
  > * {
    margin: 0 0 2rem 0;
  }
`;

export const PageHeading = styled.div`
  padding-left:19px;
`
export const CourseTitle = styled.div`
  font-size: ${fontSizes.SUBHEADER};
  color: ${colours.GRAY3};
  font-weight: bold;
`;

export const TutorTitle = styled.div`
  margin-top: 10px;
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY4};
`;

export const StudentProgressCard = styled.div`
  height: 294px;
  width: auto;
  padding: 20px;
  border: 1px solid ${colours.GRAY6};
  overflow-x: hidden;

`;

export const CardTitle = styled.div`
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY1};
  font-weight: bold !important;
`;

export const StudentProgressWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  > * {
    flex: 0 0 50%;
  }

`

export const ProgressBarWrapper = styled.div``



import styled from "styled-components";
import { colours } from "../../../values/Colours";
import { fontSizes } from "../../../values/FontSizes";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import Box from "@material-ui/core/Box";


export const TutorContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 2rem;
  font-family: "Roboto", sans-serif;
  > * {
    margin: 0 0 2rem 0;
  }
`;

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

export const TutorViewCard = styled(Card)`
  width: 100%;
`;

export const TutorViewCardHeader = styled(CardHeader)`
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

export const TutorViewCardContent = styled(CardContent)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: ${colours.WHITE};
  color: ${colours.GRAY2};
  align-items: center;
  padding: 2rem !important;
  padding: ${({ removePadTop }) => (removePadTop ? "0 2rem 2rem 2rem !important" : "2rem !important")};
`;

export const TutorViewRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const TutorViewColumn = styled.div`
  display: flex;
  flex-direction: column;
`;
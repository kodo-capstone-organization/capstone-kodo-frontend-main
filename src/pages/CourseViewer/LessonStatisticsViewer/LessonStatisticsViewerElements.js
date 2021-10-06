import styled from "styled-components";
import { colours } from "../../../values/Colours";
import { fontSizes } from "../../../values/FontSizes";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

export const LessonStatisticsViewerContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 2rem;
  font-family: "Roboto", sans-serif;
  > * {
    margin: 0 0 2rem 0;
  }
`;

export const LessonStatisticsViewerCard = styled(Card)`
  width: 100%;
`;

export const LessonStatisticsViewerCardHeader = styled(CardHeader)`
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

export const LessonStatisticsViewerCardContent = styled(CardContent)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: ${colours.WHITE};
  color: ${colours.GRAY2};
  align-items: center;
  padding: 2rem !important;
  padding: ${({ removePadTop }) => (removePadTop ? "0 2rem 2rem 2rem !important" : "2rem !important")};
`;

export const LessonStatisticsViewerRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const LessonStatisticsViewerColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LessonStatisticsViewerText = styled.div`
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY3};
  font-weight: bold;
`;

export const CheckIcon = styled(CheckCircleIcon)`
  color: ${colours.GREEN};
`;

export const CrossIcon = styled(CancelIcon)`
  color: ${colours.RED};
`;
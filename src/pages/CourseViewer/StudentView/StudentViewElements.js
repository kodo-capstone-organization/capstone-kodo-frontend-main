import styled from "styled-components";
import { Link } from "react-router-dom";
import { colours } from "../../../values/Colours";
import { fontSizes } from "../../../values/FontSizes";
import { Avatar, Card, CardHeader, CardContent } from "@material-ui/core";
import Chip from '@material-ui/core/Chip';


export const StudentContainer = styled.div`
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

export const CardTitle = styled.div`
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY1};
  font-weight: bold !important;
  margin-left: 20px;
`;

export const TutorDetails = styled.div`
    display: flex;
    width: 295px;
    flex-wrap: wrap;
    > * {
    flex: 0 0 50%;
    }
    margin-bottom: 100px;
`

export const ProfileAvatar = styled(Avatar)`
`;

export const TutorText = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    
`
export const TutorName = styled.div`
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY1};
  font-weight: bold !important;
  padding-bottom: 10px;
  padding-left: 10px;
`;

export const TutorDepartment = styled.div`
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY3};
  padding-left: 10px;

`;

export const RatingCard = styled.div`
  display: grid;
  grid-template-columns: 300px 500px;
  grid-gap: 3rem;

`

export const RatingTitle = styled.div`
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY1};
  font-weight: bold !important;
  margin-left: 20px;
`

export const RatingDescription = styled.div`
  font-size: ${fontSizes.SUBTEXT};
  color: ${colours.GRAY3};

`;

export const TagWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  > * {
  margin: theme.spacing(0.5)

`

export const TagChip = styled(Chip)`
  color: ${colours.BLUE2};
  margin-right: 12px;
  min-width: 80px;
`;

export const CourseRatingWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  > * {
  margin: theme.spacing(0.5)
`

export const StudentViewCard = styled(Card)`
    width: 100%;
`;

// export const StudentViewCard = styled.div`
//   height: 294px;
//   width: auto;
//   padding: 20px;
//   border: 1px solid ${colours.GRAY6};
//   overflow-x: hidden;
// `;

export const StudentViewCardHeader = styled(CardHeader)`
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

export const StudentViewCardContent = styled(CardContent)`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    background-color: ${colours.WHITE};
    color: ${colours.GRAY2};
    align-items: center;
    padding: 2rem !important;
    padding: ${({ removePadTop }) => (removePadTop ? "0 2rem 2rem 2rem !important" : "2rem !important")};
`;

export const StepperIcon = styled(Link)`
`

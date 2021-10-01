import styled from "styled-components";
import Chip from '@material-ui/core/Chip';
import { fontSizes } from "../../../values/FontSizes";
import { colours } from "../../../values/Colours";

export const PreviewContainer = styled.div`
    padding: 2rem;
    font-family: "Roboto", sans-serif;
    > * {
        margin: 0 0 1rem 0;
    }
`;

export const EnrollCard = styled.div`
    height: 150px;
    width: auto;
    border-radius: 20px;
    margin-bottom: 40px;
`;

export const EnrollImage = styled.img`
    height: 100%;
    width: 100%;
    border-radius: 20px;
    object-fit: cover;
`;


export const EnrollBtn = styled.nav`
    margin-top: -50px;
    margin-right: 10px;
    display: flex;
	justify-content: flex-end;
	margin-left: 0
`;

export const CourseTags = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    > * {
    margin: theme.spacing(0.5)
`;

export const TagChip = styled(Chip)`
    margin: 2px !important;
    min-width: 80px;
`;

export const CourseHeader = styled.div`
    font-size: ${fontSizes.SUBHEADER};
    color: ${colours.BLUE1};
    font-weight: bold;
`
export const CourseProviderName = styled.div`
    font-size: ${fontSizes.SUBTEXT};
    color: ${colours.GRAY1};
    text-decoration: underline;
    margin-bottom: 40px;

`

export const CourseDescription = styled.div`
    font-size: ${fontSizes.SUBTEXT};
    color: ${colours.GRAY1};
    margin-bottom: 40px;
`
export const CoursePrice = styled.div`
    font-size: ${fontSizes.HEADER};
    color: ${colours.GRAY3};
    font-weight: bold;
    margin-bottom: 40px;
`

export const SyllabusCard = styled.div`
    height: auto;
    width: auto;
    border-radius: 20px;
    margin-bottom: 40px;
    background: ${colours.GRAY7}
`;

export const SyllabusTable = styled.table`
    border-collapse: collapse;
    color: ${colours.GRAY2};
    width: 100%;
`

export const SyllabusTableData = styled.td`
    text-align: left;
    padding: 8px;
    text-align: center;
    //border: 1px solid #dddddd;
    border-radius: 20px;
`
export const SyllabusTableHeader = styled.th`
    text-align: left;
    padding: 8px;
    text-align: center;
    //border: 1px solid #dddddd;
`



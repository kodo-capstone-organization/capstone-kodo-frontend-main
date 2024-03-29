import styled from "styled-components";
import { colours } from "../../values/Colours";
import Chip from '@material-ui/core/Chip';

export const BrowseContainer = styled.div`
    padding: 2rem;
    font-family: "Roboto", sans-serif;
    > * {
        margin: 0 0 2rem 0;
    }
`;

export const CourseWrapper = styled.div`
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(5,1fr);

    @media screen and (max-width: 1800px) {
        grid-template-columns: repeat(4, 1fr);
    }

    @media screen and (max-width: 1530px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media screen and (max-width: 1263px) {
        grid-template-columns: repeat(2, 1fr);
    }
    
    @media screen and (max-width: 990px) {
        grid-template-columns: repeat(1, 1fr);
    }
`


export const Title = styled.h4`
    color: ${colours.GRAY2};
`

export const InputWrapper = styled.div`
    width: 100%;
`;


export const TagsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const CourseTags = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    > * {
        margin: theme.spacing(0.5)
    }
`;

export const TagChip = styled(Chip)`
    margin: 2px !important;
    min-width: 80px;
`;

export const SearchContainer = styled.form`
    display: flex;
`

export const MessageContainer = styled.div`
  display: flex;
  margin: 150px;
  padding: 150px;
  align-items: center;
  justify-content: center;
`

export const Message = styled.h1`
  display: flex;
  color: ${colours.BLUE1}
`




import styled from "styled-components";
import Paper from '@material-ui/core/Paper';

// export const InfoCard = styled.div`
//   background: ${({ primary }) => (primary ? colours.BLUE1 : colours.WHITE)};
//   color: ${props => props.primary ? colours.WHITE : colours.BLUE1};
//   border: 2px solid ${colours.BLUE1};
//   border-radius: 25px;
//   width: 500px;
//   height: 700px;
//   padding: 0px 100px 0px 100px;
//   text-align: center;
//   justify-content: center;
//   font-family: "Roboto", sans-serif;
// `;

// export const Wrapper = styled.section`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100%;
//   width: 100%;
// `;

export const SignUpPaper = styled(Paper)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 500px;
    height: 600px;
    text-align: center;
    font-family: "Roboto", sans-serif;
    padding: 3rem;
`;

export const SignUpPaperWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;`
  ;

export const SignUpForm = styled.div`
  display: flex;
  flex-direction: column;
`;
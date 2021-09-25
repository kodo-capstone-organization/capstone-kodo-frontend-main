import styled from "styled-components";
import Paper from '@material-ui/core/Paper';

export const SignUpPaper = styled(Paper)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 30%;
    min-width: 300px;
    height: 100%;
    text-align: center;
    font-family: "Roboto", sans-serif;
    padding: 3rem;
`;

export const SignUpPaperWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const SignUpForm = styled.div`
  display: flex;
  flex-direction: column;
`;
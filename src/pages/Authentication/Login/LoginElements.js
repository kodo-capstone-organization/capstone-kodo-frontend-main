import styled from "styled-components";
import Paper from '@material-ui/core/Paper';
import { TextField } from "@material-ui/core";

export const LoginPaper = styled(Paper)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 500px;
    min-height: 500px;
    padding: 3rem;
`;

export const LoginPaperWrapper = styled.div`
    width: 100%
`;

export const LoginForm = styled.div`
    display: flex;
    flex-direction: column;
`;

export const LoginSettingField = styled(TextField)`
    width: -webkit-fill-available;
    margin: 20px;
    
`;
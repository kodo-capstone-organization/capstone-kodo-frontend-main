import {Breadcrumbs, Link, Typography } from "@material-ui/core";
import { BlankStateContainer } from "./InvalidPageElements";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function Invalid(props: any) {

    const errorObj = props.location.state?.errorData;

    return (
        <BlankStateContainer style={{ padding: "2rem 0"}}>
            <Typography variant="h5">{errorObj.message1}</Typography>
            <br/>
            { errorObj.errorStatus === 403 && <Typography>You do not have permission to be here 😕</Typography> }
            { errorObj.errorStatus === 404 && <Typography>{errorObj.message2} 👀</Typography> }
            <br/>
            <Breadcrumbs aria-label="invalidsession-breadcrumb" style={{ marginBottom: "1rem"}}>
                <Link color="primary" href={errorObj.returnPath}>
                    <ArrowBackIcon style={{ verticalAlign: "middle"}}/>&nbsp;
                    <span style={{ verticalAlign: "bottom"}}>Back To Safety!</span>
                </Link>
            </Breadcrumbs>
        </BlankStateContainer>
    )
}

export default Invalid;
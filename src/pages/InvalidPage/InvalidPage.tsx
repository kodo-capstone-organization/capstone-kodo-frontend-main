import {Breadcrumbs, Link, Typography } from "@material-ui/core";
import { BlankStateContainer, ArrowBack } from "./InvalidPageElements";

function InvalidPage(props: any) {

    const errorObj = props.location.state?.errorData;

    return (
        <BlankStateContainer>
            <Typography variant="h5">{errorObj.message1}</Typography>
            <br/>
            { errorObj.errorStatus === 403 && <Typography>You do not have permission to be here 😕</Typography> }
            { errorObj.errorStatus === 404 && <Typography>{errorObj.message2} 👀</Typography> }
            <br/>
            <Link color="primary" href={errorObj.returnPath}>
                <ArrowBack/>
                <span style={{ verticalAlign: "bottom"}}>Back to {errorObj.returnText}</span>
            </Link>
        </BlankStateContainer>
    )
}

export default InvalidPage;
import {Breadcrumbs, Link, Typography } from "@material-ui/core";
import { BlankStateContainer } from "../../ProfilePage/ProfileElements";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function InvalidSessionPage(props: any) {

    const errorObj = props.location.state?.errorData;

    return (
        <BlankStateContainer style={{ padding: "2rem 0"}}>
            <Typography variant="h5">Unable to join session</Typography>
            <br/>
            { errorObj.status === 403 && <Typography>You were not invited to the session 😕</Typography> }
            { errorObj.status === 404 && <Typography>Session cannot be found 👀</Typography> }
            <br/>
            <Breadcrumbs aria-label="invalidsession-breadcrumb" style={{ marginBottom: "1rem"}}>
                <Link color="primary" href={`/session`}>
                    <ArrowBackIcon style={{ verticalAlign: "middle"}}/>&nbsp;
                    <span style={{ verticalAlign: "bottom"}}>Back To Session Overview</span>
                </Link>
            </Breadcrumbs>
        </BlankStateContainer>
    )
}

export default InvalidSessionPage;
import React from 'react'
import {
    Title,
    Subject,
    CourseDetails,
    CourseElement,
    TutorName,
    Button
} from "./ProgressElements";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
// import { Button } from "../../values/ButtonElements";
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing(2),
    },
}));

var topics = [
    { title: 'Python Programming'},
    { title: 'Web Development' }
];

var currentCourses = [
    { title: 'Python for Beginners', tutor: 'Nelson Jamal', status: true, id: '', imageURL: '' },
    { title: 'Python for Intermediate', tutor: 'Tutor Trisha', status: false, id: '', imageURL: '' }
];

var completedCourses = [
    { title: 'HTML', tutor: 'Nelson Jamal', id: '', imageURL: '' },
    { title: 'CSS', tutor: 'Tutor Trisha', id: '', imageURL: '' }
];

function ProgressPage() {

    const [spacing, setSpacing] = React.useState(2)
    const classes = useStyles();

    const currentCourseItems = currentCourses.map((course) =>
        <CourseElement>
            <Avatar style={{ margin: "auto 10px" }} />
            <CourseDetails>
                <h3>{course.title}</h3>
                <TutorName>{course.tutor}</TutorName>
            </CourseDetails>
            <Button primary={course.status} >{course.status ? 'Resume' : 'Start'}</Button>
        </CourseElement>
    );

    const completedCourseItems = completedCourses.map((course) =>
        <CourseElement>
            <Avatar style={{ margin: "auto 10px" }} />
            <CourseDetails>
                <h3>{course.title}</h3>
                <TutorName>{course.tutor}</TutorName>
            </CourseDetails>
            <Button >View</Button>
        </CourseElement>
    );

    return (
        <div
            style={{
                marginLeft: "16px",
                color: "#000000",
                background: "white",
            }}
        >
            <Title>My Progress</Title>
            <Grid container>
                {
                    topics.map((topic) =>
                        <Grid item xs={5} style={{margin: "5px"}}>
                            <Subject>{topic.title}</Subject>
                            <Divider />
                            {currentCourseItems}
                        </Grid>
                    )
                }
            </Grid>
            <br />
            <Grid container>
                <Grid item xs={5} style={{margin: "5px"}}>
                    <Subject>My Completed Courses</Subject>
                    <Divider />
                    {completedCourseItems}
                </Grid>
            </Grid>
        </div>
    )
}

export default ProgressPage

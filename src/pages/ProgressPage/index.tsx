import React, { useState, useEffect } from 'react'
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
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { Account } from "../../apis/Entities/Account";
import { getMyAccount } from "../../apis/Account/AccountApis";
import { EnrolledCourse } from "../../apis/Entities/EnrolledCourse";
// import { EnrolledCourse } from "../../apis/Entities/EnrolledCourse";
import { getCourseByCourseId } from "../../apis/Course/CourseApis";





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
    { title: 'Python Programming' },
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
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
    const classes = useStyles();
    const accountId = JSON.parse(window.sessionStorage.getItem('loggedInAccount') || '{}');
    // parseInt(window.sessionStorage.getItem("loggedInAccount"));

    useEffect(() => {
        getMyAccount(accountId).then(receivedAccount => {
            setEnrolledCourses(receivedAccount.enrolledCourses)
<<<<<<< HEAD
<<<<<<< HEAD
            // getCourseByCourseId
        });

=======
            // console.log(enrolledCourses[0].completedLessons)
        });
>>>>>>> creation of lesson entity to populate progress page
=======
            // getCourseByCourseId
        });

>>>>>>> displaying lessons in my progress page
    }, [])

    const currentCourseItems = enrolledCourses.map((course) =>
        <CourseElement>
            <Avatar style={{ margin: "auto 10px" }} />
            <CourseDetails>
<<<<<<< HEAD
<<<<<<< HEAD
                <h3>{course.parentCourse.lessons[0].name}</h3>
                {/* <TutorName>{course.parentCourse.tutor.name}</TutorName> */}
=======
                <h3>{course.parentCourse.name}</h3>
                <TutorName>{course.parentCourse.tutor.name}</TutorName>
>>>>>>> creation of lesson entity to populate progress page
=======
                <h3>{course.parentCourse.lessons[0].name}</h3>
                {/* <TutorName>{course.parentCourse.tutor.name}</TutorName> */}
>>>>>>> displaying lessons in my progress page
            </CourseDetails>
            {/* <Button primary={course.status} >{course.status ? 'Resume' : 'Start'}</Button> */}
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
                    enrolledCourses.map((course) =>
<<<<<<< HEAD
<<<<<<< HEAD
                        <Grid item xs={5} style={{ margin: "5px" }}>
=======
                        <Grid item xs={5} style={{margin: "5px"}}>
>>>>>>> creation of lesson entity to populate progress page
=======
                        <Grid item xs={5} style={{ margin: "5px" }}>
>>>>>>> displaying lessons in my progress page
                            <Subject>{course.parentCourse.name}</Subject>
                            <Divider />
                            {currentCourseItems}
                        </Grid>
                    )
                }
            </Grid>
            <br />
            <Grid container>
                <Grid item xs={5} style={{ margin: "5px" }}>
                    <Subject>My Completed Courses</Subject>
                    <Divider />
                    {completedCourseItems}
                </Grid>
            </Grid>
        </div>
    )
}

export default ProgressPage

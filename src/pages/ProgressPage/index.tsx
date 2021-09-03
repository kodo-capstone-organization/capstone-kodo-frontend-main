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
import { getMyAccount } from "../../apis/Account/AccountApis";
import { EnrolledCourse } from "../../apis/Entities/EnrolledCourse";
import { Course } from "../../apis/Entities/Course";
import { Lesson } from "../../apis/Entities/Lesson";
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
    const accountId = JSON.parse(window.sessionStorage.getItem('loggedInAccountId') || '{}');
    // parseInt(window.sessionStorage.getItem("loggedInAccount"));

    useEffect(() => {
        getMyAccount(accountId).then(receivedAccount => {
            setEnrolledCourses(receivedAccount.enrolledCourses)
        });

    }, [])

    // const currentCourseItems = enrolledCourses.map((course) =>
    //     <CourseElement>
    //         <Avatar style={{ margin: "auto 10px" }} />
    //         <CourseDetails>
    //             <h3>{course.parentCourse.lessons[0].name}</h3>
    //             {/* <TutorName>{course.parentCourse.tutor.name}</TutorName> */}
    //         </CourseDetails>
    //         {/* <Button primary={course.status} >{course.status ? 'Resume' : 'Start'}</Button> */}
    //     </CourseElement>
    // );

    const getCourseLessons = (parentCourse: Course) => {
        var lessons: Lesson[] = parentCourse.lessons;
        console.log("lessons", lessons);
        return (
            <div>
                {lessons.map(function (lesson, lessonId) {
                    return (
                        // <li key={ lessonId }>{lesson.name}</li>
                        <CourseElement key={lessonId}>
                            <Avatar style={{ margin: "auto 10px" }} />
                            <CourseDetails>
                                <h3>{lesson.name}</h3>
                            </CourseDetails>
                            <Button primary>Start</Button>
                        </CourseElement>
                    );
                })}
            </div>
        )
    }

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


                        <Grid item xs={5} style={{ margin: "5px" }}>
                            <Subject>{course.parentCourse.name}</Subject>
                            <Divider />
                            {getCourseLessons(course.parentCourse)}
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

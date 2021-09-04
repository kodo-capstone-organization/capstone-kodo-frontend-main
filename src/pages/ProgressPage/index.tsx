import React, { useState, useEffect } from 'react'
import {
    Title,
    MultiMediaText,
    CourseDetails,
    CourseElement,
    TutorName,
    Button,
    Subject
} from "./ProgressElements";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { getMyAccount } from "../../apis/Account/AccountApis";
import { EnrolledCourse } from "../../apis/Entities/EnrolledCourse";
import { Course } from "../../apis/Entities/Course";
import { Lesson } from "../../apis/Entities/Lesson";
import { CompletedLesson } from "../../apis/Entities/CompletedLesson";
import { Content } from "../../apis/Entities/Content";
import Link from '@material-ui/core/Link';
import LockIcon from '@material-ui/icons/Lock';


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

    const getCourseLessons = (parentCourse: Course) => {
        var lessons: Lesson[] = parentCourse.lessons;
        return (
            <div>
                {lessons.map(function (lesson, lessonId) {
                    return (
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

    const getLessonMultimedia = (parentLesson: Lesson) => {
        var contents: Content[] = parentLesson.contents;
        console.log(contents.toLocaleString)
        return (
            <div style={{ display: "flex" }}>
                {contents.map(function (content, contentId) {
                    return (
                        <Link><MultiMediaText key={contentId}>{content.name},</MultiMediaText></Link>
                    );
                })}
            </div>
        )
    }

    const getCompletedLessons = (course: EnrolledCourse) => {
        // list of all completed Lesson parent Id
        var listOfCompletedLessonsId: number[] = course.completedLessons.map(x => x.parentLesson.lessonId);
        // list of all lessons
        var allLessons: Lesson[] = course.parentCourse.lessons;
        // list to populate html
        var listOfLessons: any[] = []
        allLessons.map((lesson) => {
            var lessonWithStatus : any;
            if (listOfCompletedLessonsId.includes(lesson.lessonId)) { //lesson is completed
                lessonWithStatus = Object.assign(lesson, { isCompleted: true });
            } else {
                lessonWithStatus = Object.assign(lesson, { isCompleted: false });
            }
            listOfLessons.push(lessonWithStatus)
        })
        return (
            <div>
                {listOfLessons.map(function (lesson, lessonId) {
                    return (
                        <CourseElement key={lessonId}>
                            <Avatar style={{ margin: "auto 10px" }} />
                            <CourseDetails>
                                <h3>{lesson?.name}</h3>
                                {getLessonMultimedia(lesson)}
                            </CourseDetails>
                            <Button primary={lesson.isCompleted}>{lesson.isCompleted ? "Resume" : <LockIcon/>}</Button>
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
                            {getCompletedLessons(course)}
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

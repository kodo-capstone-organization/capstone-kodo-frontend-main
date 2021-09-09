import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {
    CourseDetails,
    CourseElement,
    Button,
    Subject,
    EmptyStateText
} from "../ProgressElements";
import {
    Avatar, Divider, Grid
} from "@material-ui/core";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { Account } from "../../../apis/Entities/Account";
import { Lesson } from "../../../apis/Entities/Lesson";
import LockIcon from '@material-ui/icons/Lock';
import MultimediaModal from './MultimediaModal';
import { useHistory } from 'react-router';

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

function CourseList(props: any) {

    const [myCourses, setMyCourses] = useState<EnrolledCourse[]>([])
    const [myAccount, setMyAccount] = useState<Account>()
    const [showMultimedia, setShowMultimedia] = useState<Boolean>(false)
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        setMyAccount(props.account)
        setMyCourses(props.courses)
    }, [props])

    const getCourseLessons = (course: EnrolledCourse) => {
        var listOfEnrolledLessonId: number[] = course.enrolledLessons.map(x => x.parentLesson.lessonId);
        var listOfAllLessonId: Lesson[] = course.parentCourse.lessons;
        var finalListOfLesson: any[] = []
        listOfAllLessonId.map((lesson) => {
            var lessonWithStatus: any;
            if (listOfEnrolledLessonId.includes(lesson.lessonId)) { //lesson is completed
                lessonWithStatus = Object.assign(lesson, { isCompleted: true });
            } else {
                lessonWithStatus = Object.assign(lesson, { isCompleted: false });
            }
            finalListOfLesson.push(lessonWithStatus)
            return
        })
        return (
            <div>
                {finalListOfLesson.map(function (lesson, lessonId) {
                    return (
                        <>
                            <CourseElement key={lessonId}>
                                <Avatar style={{ margin: "auto 10px" }} />
                                <CourseDetails>
                                    <h3>{lesson?.name}</h3>
                                </CourseDetails>
                                <MultimediaModal show={showMultimedia} account={myAccount} lesson={lesson}/>
                                {
                                    course.dateTimeOfCompletion === null ? (lesson.isCompleted ? <Button primary={lesson.isCompleted} to={`/overview/lesson/${course.parentCourse.courseId}/${lesson.lessonId}`}>Resume</Button> :
                                        <LockIcon />) : <Button primary={lesson.isCompleted} to={`/overview/lesson/${course.parentCourse.courseId}/${lesson.lessonId}`}>View</Button>
                                }
                            </CourseElement>
                        </>
                    );
                })}
            </div>
        )
    }

    return (
        <>
            {
                myCourses?.length > 0 &&
                <Grid container>
                    {
                        myCourses.map((course, courseId) =>
                            <Grid item xs={5} key={courseId} style={{ margin: "5px" }}>
                                <Subject>{course.parentCourse.name}</Subject>
                                <Divider />
                                {getCourseLessons(course)}
                            </Grid>
                        )
                    }
                </Grid>
            }
            {
                myCourses?.length === 0 &&
                <EmptyStateText>No courses, sorry! 😢</EmptyStateText>

            }
        </>
    )
}

export default CourseList

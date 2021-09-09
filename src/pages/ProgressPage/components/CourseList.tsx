import React, { useState, useEffect } from 'react'
import {
    CourseDetails,
    CourseElement,
    TutorName,
    Button,
    Subject,
    EmptyStateText
} from "../ProgressElements";
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { Account } from "../../../apis/Entities/Account";
import { Lesson } from "../../../apis/Entities/Lesson";
import Link from '@material-ui/core/Link';
import LockIcon from '@material-ui/icons/Lock';
import InfoIcon from '@material-ui/icons/Info';
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
    const [selectedLesson, setSelectedLesson] = useState<any>()
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        setMyAccount(props.account)
        setMyCourses(props.courses)
    }, [props])

    const openModal = () => {
        setShowMultimedia(true);
    }

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
                                    lesson.isCompleted ? <Button primary={lesson.isCompleted} to={`/overview/lesson/${course.parentCourse.courseId}/${lesson.lessonId}`}>Resume</Button> :
                                        <LockIcon />
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
                <EmptyStateText>No courses, sorry!</EmptyStateText>

            }
        </>
    )
}

export default CourseList

import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {
    LessonAvatar,
    CourseElement,
    Subject,
    EmptyStateContainer
} from "../ProgressElements";
import { Button } from '../../../values/ButtonElements';

import { Divider, Grid, Typography } from "@material-ui/core";
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
    const history = useHistory();

    useEffect(() => {
        setMyAccount(props.account)
        setMyCourses(props.courses)
    }, [props])

    const displayBannerUrl = (course: EnrolledCourse) => {
        if (course.parentCourse.bannerUrl !== null) {
            console.log(course.parentCourse.bannerUrl)
            return course.parentCourse.bannerUrl;
        } else {
            return "/chessplaceholder.png";
        }
    }

    const navigateToBrowseCoursePage = () => {
        history.push('/browsecourse');
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
            return
        })
        return (
            <div>
                {finalListOfLesson.map(function (lesson, lessonId) {
                    return (
                        <>
                            <CourseElement key={lessonId}>
                                <LessonAvatar src="/chessplaceholder.png"
                                    alt={course.parentCourse.name} />
                                <Subject>{lesson?.name}</Subject>
                                <MultimediaModal show={showMultimedia} account={myAccount} lesson={lesson} />
                                {
                                    course.dateTimeOfCompletion === null ? (lesson.isCompleted ? <Button variant="outlined" primary={lesson.isCompleted} to={`/overview/lesson/${course.parentCourse.courseId}/${lesson.lessonId}`}>Resume</Button> :
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
                                <h4>{course.parentCourse.name}</h4>
                                <Divider />
                                {getCourseLessons(course)}
                            </Grid>
                        )
                    }
                </Grid>
            }
            {
                myCourses?.length === 0 &&
                <EmptyStateContainer>
                    <Typography>No courses here! 😢</Typography>
                    <br/>
                    <Button onClick={navigateToBrowseCoursePage} style={{ width: "10%" }} big>Browse Courses</Button>
                </EmptyStateContainer>
            }
        </>
    )
}

export default CourseList

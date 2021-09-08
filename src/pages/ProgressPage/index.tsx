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
import { Account } from "../../apis/Entities/Account";
import { Lesson } from "../../apis/Entities/Lesson";
import { Content } from "../../apis/Entities/Content";
import Link from '@material-ui/core/Link';
import LockIcon from '@material-ui/icons/Lock';
import CourseList from './components/CourseList';
import MultimediaModal from './components/MultimediaModal';


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

function ProgressPage() {

    // const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
    const [completedCourses, setCompletedCourses] = useState<EnrolledCourse[]>([])
    const [currentCourses, setCurrentCourses] = useState<EnrolledCourse[]>([])
    const [myAccount, setMyAccount] = useState<Account>()
    const classes = useStyles();
    const accountId = window.sessionStorage.getItem("loggedInAccountId");

    useEffect(() => {
        if (accountId !== null) {
            getMyAccount(parseInt(accountId)).then((receivedAccount: Account) => {
                setMyAccount(receivedAccount)
                const updatedCompletedCourses = receivedAccount.enrolledCourses.filter(course => course.dateTimeOfCompletion !== null)
                setCompletedCourses(updatedCompletedCourses)
                const updatedCurrentCourses = receivedAccount.enrolledCourses.filter(course => course.dateTimeOfCompletion === null)
                setCurrentCourses(updatedCurrentCourses)
            });
        }
    }, [])

    const getLessonMultimedia = (parentLesson: Lesson) => {
        var contents: Content[] = parentLesson.contents;
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

    return (
        <div
            style={{
                marginLeft: "16px",
                color: "#000000",
                background: "white",
            }}
        >
            <Title>My Progress</Title>
            <Subject>Current Courses</Subject>
            <Divider />
            <CourseList account={myAccount} courses={currentCourses} />
            <br />
            <Subject>Completed Courses</Subject>
            <Divider />
            <CourseList account={myAccount} courses={completedCourses} />
        </div>
    )
}

export default ProgressPage

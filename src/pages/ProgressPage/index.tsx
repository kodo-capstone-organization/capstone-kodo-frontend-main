import React, { useState, useEffect } from 'react'
import {
    Title,
    Subject
} from "./ProgressElements";
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { getMyAccount } from "../../apis/Account/AccountApis";
import { EnrolledCourse } from "../../apis/Entities/EnrolledCourse";
import { Account } from "../../apis/Entities/Account";
import CourseList from './components/CourseList';


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
    }, [accountId])

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

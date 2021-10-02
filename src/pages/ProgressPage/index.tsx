import React, { useState, useEffect } from 'react'
import {
    ProgressContainer,
    MessageContainer
} from "./ProgressElements";
import { Breadcrumbs, Link, Tabs, Tab } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getMyAccount } from "../../apis/Account/AccountApis";
import { EnrolledCourse } from "../../apis/Entities/EnrolledCourse";
import { Account } from "../../apis/Entities/Account";
import CourseList from './components/CourseList';
import { colours } from '../../values/Colours';

function ProgressPage() {

    // const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
    const [completedCourses, setCompletedCourses] = useState<EnrolledCourse[]>([])
    const [currentCourses, setCurrentCourses] = useState<EnrolledCourse[]>([])
    const [myAccount, setMyAccount] = useState<Account>()
    const [tab, setTab] = React.useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const accountId = window.sessionStorage.getItem("loggedInAccountId");

    useEffect(() => {
        setLoading(true);
        if (accountId !== null) {
            getMyAccount(parseInt(accountId)).then((receivedAccount: Account) => {
                setMyAccount(receivedAccount)
                const updatedCompletedCourses = receivedAccount.enrolledCourses.filter(course => course.dateTimeOfCompletion !== null)
                setCompletedCourses(updatedCompletedCourses)
                const updatedCurrentCourses = receivedAccount.enrolledCourses.filter(course => course.dateTimeOfCompletion === null)
                setCurrentCourses(updatedCurrentCourses)
            });
        }
        setLoading(false);
    }, [accountId])

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
    };

    const TabPanel = (props: any) => {
        const { index, data } = props;
        return (
            <div
                role="tabpanel"
                hidden={tab !== index}
            >
                {tab === index && (
                    <CourseList account={myAccount} curTabIdx={tab} courses={data} />
                )}
            </div>
        );
    }

    if (loading) return (
        <MessageContainer><CircularProgress /></MessageContainer>
    );

    return (
        <ProgressContainer>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="primary" href="/progresspage">
                    Progress
                </Link>
            </Breadcrumbs>
            <br/>
            <Tabs
                value={tab}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleTabChange}
                style={{ backgroundColor: colours.GRAY7 }}
            >
                <Tab label="Current Courses" style={{ minWidth: "50%"}} />
                <Tab label="Completed Courses" style={{ minWidth: "50%"}}/>
            </Tabs>
            <div id="panel-group">
                <TabPanel value={tab} index={0} data={currentCourses} />
                <TabPanel value={tab} index={1} data={completedCourses} />
            </div>
        </ProgressContainer>
    )
}

export default ProgressPage

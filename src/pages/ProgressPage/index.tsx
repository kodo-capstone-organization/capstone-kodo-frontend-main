import React, { useState, useEffect } from 'react'
import {
    ProgressContainer
} from "./ProgressElements";
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { Breadcrumbs, Link, Tabs, Tab } from '@material-ui/core';
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
    const [tab, setTab] = React.useState(0);
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
                    <CourseList account={myAccount} courses={data} />
                )}
            </div>
        );
    }

    return (
        <ProgressContainer>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="primary" href="/progresspage">
                    Progress
                </Link>
            </Breadcrumbs>
            <Tabs
                value={tab}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleTabChange}
            >
                <Tab label="Current Courses" />
                <Tab label="Completed Courses" />
            </Tabs>
            <div id="panel-group">
                <TabPanel value={tab} index={0} data={currentCourses}>
                </TabPanel>

                <TabPanel value={tab} index={1} data={completedCourses}>
                </TabPanel>
            </div>
        </ProgressContainer>
    )
}

export default ProgressPage

import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { Course } from "../../apis/Entities/Course";
import { Account } from "../../apis/Entities/Account";
import { EnrolledCourse } from "../../apis/Entities/EnrolledCourse";
import { getMyAccount } from "../../apis/Account/AccountApis";
import { getCourseByCourseId } from "../../apis/Course/CourseApis";
import {
  getEnrolledCourseByStudentIdAndCourseId,
} from "../../apis/EnrolledCourse/EnrolledCourseApis";
import Sidebar from "./Sidebar/Sidebar";
import TutorView from "./TutorView/TutorView";
import StudentView from "./StudentView/StudentView";
import CircularProgress from '@material-ui/core/CircularProgress';

import { LayoutContainer, MessageContainer, Message, BtnWrapper } from "./CourseViewerElements";
import { Button } from "../../values/ButtonElements";
import { LayoutContentPage } from "../../components/LayoutElements";

function CourseOverview(props: any) {
  const courseId = props.match.params.courseId;
  const [currentUser, setUser] = useState<Account>();
  const [currentCourse, setCourse] = useState<Course>();
  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();
  const [loading, setLoading] = useState<Boolean>(true);

  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );


  useEffect(() => {
    setLoading(true);
    getMyAccount(accountId).then(receivedAccount => {
      setUser(receivedAccount);
    });
    getCourseByCourseId(courseId).then(receivedCourse => {
      setCourse(receivedCourse);
      setLoading(false);
    });
    getEnrolledCourseByStudentIdAndCourseId(accountId, courseId).then(receivedEC => {
      setEnrolledCourse(receivedEC)
    })
  }, []);

  //if current logged in user is enrolled in this course, returns true
  function courseIsEnrolled(): boolean {
    if (currentUser && currentCourse) {
      let userEnrolledCourses = currentUser.enrolledCourses;
      var userParentCourses = userEnrolledCourses.map(function (c) {
        return c.parentCourse.courseId;
      });
      if (userParentCourses?.includes(currentCourse.courseId)) {
        return true;
      }
    }
    return false;
  }


  //if current user is this course's tutor this function, returns true
   function isCourseTutor(): boolean {
     if (currentUser && currentCourse) {
       if (currentCourse.tutor.accountId === currentUser?.accountId) {
       return true;
     }
    }
    return false;
   }



  if (loading) return (
    <MessageContainer><CircularProgress /></MessageContainer>
  );

  if (currentUser && currentCourse && !courseIsEnrolled() && !isCourseTutor()) return (
    <>
    <MessageContainer isEnrolled={courseIsEnrolled()} isTutor={isCourseTutor()}>
      <Message>You are not enrolled in this course 😡</Message>
    </MessageContainer>
    <BtnWrapper isEnrolled={courseIsEnrolled()} isTutor={isCourseTutor()}>
      <Button primary to={`/browsecourse`}>Browse Courses</Button>
    </BtnWrapper>
    </>

  );

  return (
    <>
    <LayoutContainer>
      { (courseIsEnrolled() || isCourseTutor()) &&
          <>
            <Sidebar course={currentCourse} isTutorView={isCourseTutor()}/>
            <LayoutContentPage showSideBar style={{ paddingRight: "10rem"}}>
              { isCourseTutor() && <TutorView course={currentCourse}/>  }
              { courseIsEnrolled() && <StudentView course={currentCourse} account={currentUser} enrolledCourse={enrolledCourse}/> }
            </LayoutContentPage>
          </>
      }

      {/*{courseIsEnrolled() &&*/}
      {/*<> */}
      {/*  <Sidebar course={currentCourse}/>*/}
      {/*  <StudentView course={currentCourse} account={currentUser} enrolledCourse={enrolledCourse}/> */}
      {/*</>*/}
      {/*}*/}
      {/*{isCourseTutor() &&*/}
      {/*<>*/}
      {/*  <Sidebar course={currentCourse}/>*/}
      {/*  <TutorView course={currentCourse}/>*/}
      {/*</>*/}
      {/*}*/}
    </LayoutContainer>
    </>
  );
}

const CourseOverviewWithRouter = withRouter(CourseOverview);
export default CourseOverviewWithRouter;

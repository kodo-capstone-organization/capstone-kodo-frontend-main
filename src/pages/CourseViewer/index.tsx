import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { Course } from "../../apis/Entities/Course";
import { Account } from "../../apis/Entities/Account";
import { getMyAccount } from "../../apis/Account/AccountApis";
import { getCourseByCourseId } from "../../apis/Course/CourseApis";
import Sidebar from "./Sidebar/Sidebar";
import TutorView from "./TutorView/TutorView"
import StudentView from "./StudentView/StudentView"

import { LayoutContainer } from "./CourseViewerElements";

function CourseOverview(props: any) {
  const courseId = props.match.params.courseId;
  const [currentUser, setUser] = useState<Account>();
  const [currentCourse, setCourse] = useState<Course>();
  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  useEffect(() => {
    getCourseByCourseId(courseId).then(receivedCourse => {
      setCourse(receivedCourse);
    });
  }, []);

  useEffect(() => {
    getMyAccount(accountId).then(receivedAccount => {
      setUser(receivedAccount);
    });
  }, []);

  //if current logged in user is enrolled in this course, returns true
  function courseIsEnrolled(course: Course): boolean {
        
    let userEnrolledCourses = currentUser?.enrolledCourses;
    var userParentCourses = userEnrolledCourses?.map(function(c) {
        return c.parentCourse.courseId;
    });
    if (userParentCourses?.includes(course.courseId)) {
        return true;
    }
    return false;
  }

  //if current user is this course's tutor this function, returns true
  function isCourseTutor(course: Course): boolean {
        
    if(course.tutor.accountId == currentUser?.accountId) {
      return true;
    }
    return false;
  }



  return (
    <>
    <LayoutContainer>
      <div>
      {currentCourse && !courseIsEnrolled(currentCourse) && !isCourseTutor(currentCourse) &&
      <h1>You are not enrolled in this course 😡</h1>
      }
      </div>
      {currentCourse && courseIsEnrolled(currentCourse) &&
      <> 
        <Sidebar course={currentCourse}/>
        <StudentView course={currentCourse} account={currentUser}/> 
      </>
      }
      {currentCourse && isCourseTutor(currentCourse) &&
      <>
        <Sidebar course={currentCourse}/>
        <TutorView course={currentCourse}/>
      </>
      }
    </LayoutContainer>
    </>
  );
}

const CourseOverviewWithRouter = withRouter(CourseOverview);
export default CourseOverviewWithRouter;

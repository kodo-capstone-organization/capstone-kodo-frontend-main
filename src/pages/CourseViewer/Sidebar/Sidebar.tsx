import { useState, useEffect } from "react";
import { Course } from "../../../apis/Entities/Course";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { EnrolledLesson } from "../../../apis/Entities/EnrolledLesson";
import { Lesson } from "../../../apis/Entities/Lesson";

import { getEnrolledCourseByStudentIdAndCourseId } from "../../../apis/EnrolledCourse/EnrolledCourseApis";

import {
  SidebarWrapper,
  SidebarMenu,
  CourseBanner,
  SidebarLink,
  LessonLink,
  Home,
  Forum
} from "./SidebarElements";
import { Account } from "../../../apis/Entities/Account";

function Sidebar(props: any) {

  const [course, setCourse] = useState<Course>();
  const [account, setAccount] = useState<Account>();

  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();
  const [enrolledLessons, setEnrolledLessons] = useState<EnrolledLesson[]>();

  useEffect(() => {
    setCourse(props.course);
    setAccount(props.account);
    getEnrolledCourseByStudentIdAndCourseId(props.account.accountId, props.course.courseId)
    .then((enrolledCourse: EnrolledCourse) => {
      setEnrolledCourse(enrolledCourse);
      setEnrolledLessons(enrolledCourse.enrolledLessons);
    })
    .catch((err: any) => {
      console.log(err);
    });
  }, [props.course, props.account]);

  const handleImageError = (e: any) => {
    e.target.onerror = null;
    e.target.src = "/chessplaceholder.png"
  }

  return (
    <>
      { course &&
        <SidebarWrapper>
          <CourseBanner
              alt={course.name}
              src={course?.bannerUrl === "" ? "invalidurl.com" : course?.bannerUrl }
              onError={handleImageError}
          />
          <SidebarMenu>
            {/* TODO: Conditional Active state of links */}
            <SidebarLink 
              className={"active"} 
              to={`/overview/${course.courseId}`}
            >
              <Home/> Overview
            </SidebarLink>
              
            {/* Weekly Lesson Links */}
            { (!props.isTutorView && enrolledCourse && enrolledLessons) && 
              enrolledLessons.map(enrolledLesson => {
                return (
                  <LessonLink key={enrolledLesson.enrolledLessonId}>
                    <SidebarLink to={`/overview/lesson/${enrolledCourse.enrolledCourseId}/${enrolledLesson.enrolledLessonId}`}>Week {enrolledLesson.parentLesson.sequence}</SidebarLink>
                  </LessonLink>
                );
              })
            }
              
            {/* Discussion Forum Link */}
            <SidebarLink>
              <Forum/> Discussion Forum
            </SidebarLink>
          </SidebarMenu>
        </SidebarWrapper>
      }
    </>
  );
}

export default Sidebar;

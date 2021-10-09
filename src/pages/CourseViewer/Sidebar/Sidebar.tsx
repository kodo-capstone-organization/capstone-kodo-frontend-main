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
  Forum,
  RightArrow,
} from "./SidebarElements";
import { Account } from "../../../apis/Entities/Account";

function Sidebar(props: any) {

  const [course, setCourse] = useState<Course>();
  const [lessons, setLessons] = useState<Lesson[]>();
  const [account, setAccount] = useState<Account>();

  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();
  const [enrolledLessons, setEnrolledLessons] = useState<EnrolledLesson[]>();

  useEffect(() => {
    setCourse(props.course);
    setLessons(props.course.lessons);
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

  const showStudentView = () => {
    return (
      (!props.isTutorView && enrolledCourse && enrolledLessons) &&
      enrolledLessons.map(enrolledLesson => {
        return (
          <LessonLink
            to={`/overview/lesson/${enrolledCourse.enrolledCourseId}/${enrolledLesson.enrolledLessonId}`}
            key={enrolledLesson.enrolledLessonId}
          >
            <RightArrow /> Week {enrolledLesson.parentLesson.sequence}
          </LessonLink>
        );
      })
    );
  }

  const showTutorView = () => {
    return (
      (props.isTutorView && course && lessons) &&
      lessons.map(lesson => {
        return (
          <LessonLink
            to={`/overview/lessonstatistics/${course.courseId}/${lesson.lessonId}`}
            key={lesson.lessonId}
          >
            <RightArrow /> Week {lesson.sequence}
          </LessonLink>
        );
      })
    );
  }

  return (
    <>
      {course &&
        <SidebarWrapper>
          <CourseBanner
            alt={course.name}
            src={course?.bannerUrl === "" ? "invalidurl.com" : course?.bannerUrl}
            onError={handleImageError}
          />
          <SidebarMenu>
            {/* TODO: Conditional Active state of links */}
            <SidebarLink
              className={"active"}
              to={`/overview/${course.courseId}`}
            >
              <Home /> Overview
            </SidebarLink>

            {showStudentView()}
            {showTutorView()}

            {/* Discussion Forum Link */}
            <SidebarLink
              to={`/forum/${course.courseId}`}
            >
              <Forum /> Discussion Forum
            </SidebarLink>
          </SidebarMenu>
        </SidebarWrapper>
      }
    </>
  );
}

export default Sidebar;

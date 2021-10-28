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

import { useLocation } from "react-router";

function Sidebar(props: any) {

  const isTutor = props.isTutor;  
  const isStudent = props.isStudent;
  const accountId = JSON.parse(window.sessionStorage.getItem("loggedInAccountId") || "{}");

  const [course, setCourse] = useState<Course>();
  const [lessons, setLessons] = useState<Lesson[]>();

  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();
  const [enrolledLessons, setEnrolledLessons] = useState<EnrolledLesson[]>();

  const location = useLocation();

  useEffect(() => {
    setCourse(props.course);    
    setLessons(props.course.lessons)
    if (isStudent)
    {
      getEnrolledCourseByStudentIdAndCourseId(accountId, props.course.courseId)
      .then((enrolledCourse: EnrolledCourse) => {
        setEnrolledCourse(enrolledCourse);
        setEnrolledLessons(enrolledCourse.enrolledLessons);
      })
    }
  }, [props.course, accountId, isTutor, isStudent]);

  const handleImageError = (e: any) => {
    e.target.onerror = null;
    e.target.src = "/chessplaceholder.png"
  }

  const showStudentView = () => {
    return (
      (!isTutor && enrolledCourse && enrolledLessons) &&
        enrolledLessons.map(enrolledLesson => {
          return (
            <LessonLink
              to={`/overview/course/${enrolledCourse.enrolledCourseId}/lesson/${enrolledLesson.enrolledLessonId}`}
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
      (isTutor && course && lessons) &&
        lessons.map(lesson => {
          return (
            <LessonLink
              to={`/overview/course/${course.courseId}/lessonstatistics/${lesson.lessonId}`}
              key={lesson.lessonId}
              className={isLessonLinkActive(lesson.lessonId.toString()) ? "active" : ""}
            >
              <RightArrow /> Week {lesson.sequence}
            </LessonLink>
          );
        })
    );
  }

  const isOverviewLinkActive = () => {
    return !isForumLinkActive() && !isLessonLinkActive("");
  }

  const isLessonLinkActive = (lessonId: string) => {
    if (isTutor) {
      return location.pathname.includes(`/lessonstatistics/${lessonId}`)
    } else if (isStudent) {
      return location.pathname.includes(`lesson/${lessonId}`)
    }
  }

  const isForumLinkActive = () => {
    return location.pathname.includes("/forum")
  }

  return (
    <>
      {course &&
        <SidebarWrapper>
          <CourseBanner alt={course.name} src={course?.bannerUrl === "" ? "invalidurl.com" : course?.bannerUrl} onError={handleImageError}/>

          <SidebarMenu>
            <SidebarLink className={isOverviewLinkActive() ? "active" : "" } to={`/overview/course/${course.courseId}`}>
              <Home /> Overview
            </SidebarLink>

            {showStudentView()}
            {showTutorView()}

            {/* Discussion Forum Link */}
            <SidebarLink className={isForumLinkActive() ? "active" : ""} to={`/overview/course/${course.courseId}/forum`}>
              <Forum /> Discussion Forum
            </SidebarLink>
          </SidebarMenu>
        </SidebarWrapper>
      }
    </>
  );
}

export default Sidebar;

import { useState, useEffect } from "react";
import { Course } from "../../../apis/Entities/Course";
import { Lesson } from "../../../apis/Entities/Lesson";

import {
  SidebarWrapper,
  SidebarMenu,
  CourseBanner,
  SidebarLink,
  LessonLink
} from "./SidebarElements";

function Sidebar(props: any) {
  const [currentCourse, setCourse] = useState<Course>({ ...props.course });
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);

  useEffect(() => {
      setCourse(props.course);
      setCourseLessons(currentCourse.lessons);
  }, [currentCourse.lessons]);

  const handleImageError = (e: any) => {
    e.target.onerror = null;
    e.target.src = "/chessplaceholder.png"
  }

  return (
      <SidebarWrapper>
        <CourseBanner
            alt={currentCourse.name}
            src={currentCourse?.bannerUrl === "" ? "invalidurl.com" : currentCourse?.bannerUrl }
            onError={handleImageError}
        />
        <SidebarMenu>
          {/* TODO: Conditional Active state of links */}
          <SidebarLink className={"active"} to={`/overview/${currentCourse.courseId}`}>Overview</SidebarLink>
            
          {/* Weekly Lesson Links */}
          { !props.isTutorView && courseLessons?.map(lesson => {
            return (
              <LessonLink key={lesson.lessonId}>
                <SidebarLink to={`/overview/lesson/${currentCourse.courseId}/${lesson.lessonId}`}>Week {lesson.sequence}</SidebarLink>
              </LessonLink>
            );
          })}
            
          {/* Discussion Forum Link */}
          <SidebarLink to={`/forum/${currentCourse.courseId}`}>Discussion Forum</SidebarLink>
        </SidebarMenu>
      </SidebarWrapper>
  );
}

export default Sidebar;

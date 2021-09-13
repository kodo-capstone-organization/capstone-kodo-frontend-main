import React, { useState, useEffect } from "react";
import { Course } from "../../../apis/Entities/Course";
import { Lesson } from "../../../apis/Entities/Lesson";

import {
  SidebarWrapper,
  SidebarMenu,
  CourseBannerWrapper,
  CourseBanner,
  SidebarLink,
  LessonLink
} from "./SidebarElements";

function Sidebar(props: any) {
  const [currentCourse, setCourse] = useState<Course>({ ...props.course });
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    setCourse(props.course);
  }, []);

  useEffect(() => {
      setCourseLessons(currentCourse.lessons);
  }, [currentCourse.lessons]);

  const handleImageError = (e: any) => {
    e.target.onerror = null;
    e.target.src = "/chessplaceholder.png"
  }

  return (
      <SidebarWrapper>
        <CourseBannerWrapper>
            <CourseBanner
                alt={currentCourse.name}
                src={currentCourse?.bannerUrl === "" ? "invalidurl.com" : currentCourse?.bannerUrl }
                onError={handleImageError}
            />
        </CourseBannerWrapper>
        <SidebarMenu>
          <SidebarLink to={`/overview/${currentCourse.courseId}`}>Overview</SidebarLink>
          {courseLessons?.map(lesson => {
            return (
              <LessonLink key={lesson.lessonId}>
                <SidebarLink to={`/overview/lesson/${currentCourse.courseId}/${lesson.lessonId}`}>Week {lesson.sequence}</SidebarLink>
              </LessonLink>
            );
          })}
          <SidebarLink>Discussion Forum</SidebarLink>
        </SidebarMenu>
      </SidebarWrapper>
  );
}

export default Sidebar;
